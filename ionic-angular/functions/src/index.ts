import * as functions from "firebase-functions";
import * as cors from "cors";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import {v4 as uuid} from "uuid";
import {Storage} from "@google-cloud/storage";
import * as fbAdmin from "firebase-admin";
import {ServiceAccount} from "firebase-admin";
import * as Cert from "../ionic-app.json";
import Busboy = require("busboy");

const projectId = "ionic-angular-6ec56";
const storage = new Storage({projectId});
fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(Cert as ServiceAccount),
});

// eslint-disable-next-line max-len
export const storeImage = functions.https.onRequest((req: functions.Request, res: functions.Response) => {
  return cors({origin: true})(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({message: "Not allowed."});
    }
    // eslint-disable-next-line max-len
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      console.log("No token present");
      return res.status(403).json({error: "Unauthorized"});
    }
    const idToken = req.headers.authorization.split("Bearer ")[1];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line new-cap
    const busboy = Busboy({headers: req.headers});
    let uploadData: any;
    let oldImagePath: any;
    // eslint-disable-next-line max-len
    busboy.on("file", (fieldname: any, file: any, {filename}: any, encoding: any, mimetype: any) => {
      console.log(path.join("/tmp/", fieldname), filename);
      const filePath = path.join(os.tmpdir(), filename);
      uploadData = {filePath: filePath, type: mimetype, name: filename};
      file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on("field", (fieldname: any, value: any) => {
      oldImagePath = decodeURIComponent(value);
    });
    busboy.on("finish", () => {
      const id = uuid();
      let imagePath = "images/" + id + "-" + uploadData.name;
      if (oldImagePath) {
        imagePath = oldImagePath;
      }
      return fbAdmin.auth().verifyIdToken(idToken).then((_) => {
        console.log(uploadData.type);
        return storage
            .bucket(`${projectId}.appspot.com`)
            .upload(uploadData.filePath, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
              uploadType: "media",
              destination: imagePath,
              metadata: {
                metadata: {
                  contentType: uploadData.type,
                  firebaseStorageDownloadTokens: id,
                },
              },
            })
            .then(() => {
              return res.status(201).json({
                imageUrl:
                "https://firebasestorage.googleapis.com/v0/b/" +
                storage.bucket(`${projectId}.appspot.com`).name +
                "/o/" +
                encodeURIComponent(imagePath) +
                "?alt=media&token=" +
                id,
                imagePath: imagePath,
              });
            })
            .catch((error) => {
              console.log(error);
              return res.status(401).json({error: "Unauthorized!"});
            });
      });
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return busboy.end(req.rawBody);
  });
});
