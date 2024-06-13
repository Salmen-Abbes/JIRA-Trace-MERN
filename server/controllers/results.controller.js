import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

export const getProjectResults = async (req, res) => {
  const { name } = req.params;
  const baseDirectory = path.join(path.resolve(), `./projects/${name}`);
  if (!fs.existsSync(baseDirectory)) {
    return res.status(404).json({ message: "Project does not exist" });
  }   
  const folders = fs.readdirSync(baseDirectory).filter(folder => fs.lstatSync(path.join(baseDirectory, folder)).isDirectory());

  const result = {};

  for (const folder of folders) {
    const folderPath = path.join(baseDirectory, folder);
    const xmlFilePath = path.join(folderPath, `${folder}.xml`);
    const jsonFilePath = path.join(folderPath, `${folder}_results.json`);

    if (fs.existsSync(xmlFilePath) && fs.existsSync(jsonFilePath)) {
      const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
      const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

      // Parse XML content to a structured array
      const parser = new xml2js.Parser();
      const xmlData = await parser.parseStringPromise(xmlContent);
      const issues = xmlData.issues.issue.map(issue => {
        const parsedIssue = {};
        for (const key in issue) {
          if (issue.hasOwnProperty(key)) {
            parsedIssue[key] = issue[key][0];
          }
        }
        return parsedIssue;
      });

      result[folder] = {
        list: issues,
        graph: jsonContent
      };
    }
  }

  res.json(result);
};
