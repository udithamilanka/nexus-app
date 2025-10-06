
// Define the shape of your form data
export interface DeploymentForm {
  projectName: string;
  projectIdentifier: string;
  type: "nextjs";
  host: string;
  user: string;
  port: string;
  hostedPath: string;
  nodeVersion: string;
  branch: string;
  envType: "dev" | "qa" | "prod";
  appNamePM2: string;
}

// Optional: define the expected API response shape
export interface DeploymentResponse {
  _id: string;
  projectName: string;
  envType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Deployment {
  _id: string;
  projectName: string;
  projectIdentifier: string;
  type: string;
  host: string;
  user: string;
  port: string;
  hostedPath: string;
  nodeVersion: string;
  branch: string;
  envType: "dev" | "qa" | "prod";
  createdAt: string;
  appNamePM2: string;
}