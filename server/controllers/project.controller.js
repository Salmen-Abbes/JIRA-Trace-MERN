import Project from "../models/project.model.js";
import { errorHandler } from "../utils/error.handler.js";
import { valdiateProject } from "../validations/projects.schema.js";
import { convert } from "html-to-text";
import fs from "fs";
import path from "path";
import multer from "multer";
import xlsx from "xlsx";
import mammoth from "mammoth";
import xml2js from "xml2js";

/**
 * @desc create new  project
 * @params POST /api/project/createproject
 * @access PRIVATE (owner of this account)
 **/

export const createProject = async (req, res, next) => {
  const { name, description } = req.body;
  // validate register schema
  const { error } = valdiateProject(req.body);
  if (error) return next(errorHandler(400, `${error.details[0].message}`));
  // check if project already exists
  const existProject = await Project.find({ $or: [{ name }] });
  if (existProject.length)
    return next(errorHandler(409, "Project already exists"));

  const newProject = new Project({
    name,
    description: convert(description),
    creator: req.user.id,
  });

  try {
    await newProject.save();
    const projectFolderPath = `./projects/${req.body.name}`;
    fs.mkdirSync(projectFolderPath, { recursive: true });
    console.log(newProject);
    return res
      .status(201)
      .json({
        message: "Project created successfully",
        status: true,
        project: newProject,
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc upload files
 * @params POST /api/project/upload
 * @access PRIVATE (owner of this account)
 **/

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const selectedOption = req.params.option;
    const projectFolderPath = `./projects/${req.params.name}/${selectedOption}`;
    fs.mkdir(projectFolderPath, { recursive: true }, (err) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, projectFolderPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Helper function to convert Excel to XML
function convertExcelToXML(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet);

  const builder = new xml2js.Builder();
  const xml = builder.buildObject({ workbook: { sheet: json } });
  return xml;
}

// Helper function to convert Word to XML
async function convertWordToXML(filePath) {
  const result = await mammoth.convertToHtml({ path: filePath });
  const htmlContent = result.value;

  // Simple conversion from HTML to XML for demonstration
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({ document: { content: htmlContent } });
  return xml;
}

// Function to save XML
function saveXML(filePath, xmlContent) {
  const xmlFilePath = filePath.replace(path.extname(filePath), ".xml");
  fs.writeFileSync(xmlFilePath, xmlContent);
}

// Upload and process files
export const uploadfile = (req, res) => {
  upload.array("files")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).send(err.message);
    } else if (err) {
      return res.status(500).send("An error occurred while uploading files.");
    }

    const files = req.files;

    try {
      for (const file of files) {
        const filePath = file.path;
        const ext = path.extname(filePath).toLowerCase();
        let xmlContent = "";

        if (ext === ".xlsx") {
          xmlContent = convertExcelToXML(filePath);
        } else if (ext === ".docx") {
          xmlContent = await convertWordToXML(filePath);
        }

        if (xmlContent) {
          saveXML(filePath, xmlContent);
        }
      }

      res.json({ files: req.files });
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).send("An error occurred while processing files.");
    }
  });
};

//get all projects

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ creator: req.user.id });
    if (!projects) {
      return next(errorHandler(404, "No projects found"));
    }
    return res.status(200).json({ status: true, projects });
  } catch (error) {
    next(error);
  }
};

//update project
/**
 * @desc update project
 * @params PUT /api/project/updateproject/:id
 * @access PRIVATE (owner of this account)
 **/

export const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return next(errorHandler(404, "Project not found"));
    }

    if (project.creator.toString() !== req.user.id) {
      return next(
        errorHandler(403, "You are not authorized to update this project")
      );
    }

    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();

    return res
      .status(200)
      .json({ message: "Project updated successfully", status: true, project });
  } catch (error) {
    next(error);
  }
};
