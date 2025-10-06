import { Schema, model, models } from "mongoose";

const DeploymentSchema = new Schema(
  {
    projectName: { type: String, required: true },
    projectIdentifier: { type: String, required: true },
    type: { type: String, default: "nextjs" },
    host: { type: String, required: true },
    user: { type: String, required: true },
    port: { type: String, default: "22" },
    hostedPath: { type: String, required: true },
    nodeVersion: { type: String, required: true },
    branch: { type: String, required: true },
    envType: { type: String, enum: ["dev", "qa", "prod"], required: true },
  },
  { timestamps: true }
);

export default models.Deployment || model("Deployment", DeploymentSchema);
