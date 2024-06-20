import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'

export const allIssues = async (req, res) => {
    const { projectName } = req.body;
    const baseDirectory = path.join(path.resolve(), `./projects/${projectName}`);

    if (!fs.existsSync(baseDirectory)) {
        return res.status(404).json({ message: "Project does not exist" });
    }

    const folders = fs.readdirSync(baseDirectory).filter(folder => fs.lstatSync(path.join(baseDirectory, folder)).isDirectory());

    const issues = {
        customer: [],
        system: [],
        task: [],
        software: [],
        swad:[]
    };

    // Loop through all folders to extract issue links and linked issues for all types of issues
    for (const folder of folders) {
        const folderPath = path.join(baseDirectory, folder);
        const customerXmlFilePath = path.join(folderPath, 'customer.xml');
        const systemXmlFilePath = path.join(folderPath, 'system.xml');
        const taskXmlFilePath = path.join(folderPath, 'task.xml');
        const softwareXmlFilePath = path.join(folderPath, 'software.xml');

        if (fs.existsSync(customerXmlFilePath)) {
            const xmlContent = fs.readFileSync(customerXmlFilePath, 'utf-8');

            // Parse XML content to a structured array
            const parser = new xml2js.Parser();
            const xmlData = await parser.parseStringPromise(xmlContent);
            issues.customer = xmlData.issues.issue.map(issue => ({
                key: issue.key[0],
                issueLink1: issue.IssueLink1[0],
                issueLink2: issue.IssueLink2 ? issue.IssueLink2[0] : null,
                linkedissues1: issue.linkedissue1 ? issue.linkedissue1[0].split(',') : [],
                linkedissues2: issue.linkedissue2 ? issue.linkedissue2[0].split(',') : []
            }));
        }

        if (fs.existsSync(systemXmlFilePath)) {
            const xmlContent = fs.readFileSync(systemXmlFilePath, 'utf-8');

            // Parse XML content to a structured array
            const parser = new xml2js.Parser();
            const xmlData = await parser.parseStringPromise(xmlContent);
            issues.system = xmlData.issues.issue.map(issue => ({
                key: issue.key[0],
                issueLink1: issue.IssueLink1[0],
                issueLink2: issue.IssueLink2 ? issue.IssueLink2[0] : null,
                linkedissues1: issue.linkedissue1 ? issue.linkedissue1[0].split(',') : [],
                linkedissues2: issue.linkedissue2 ? issue.linkedissue2[0].split(',') : []
            }));
        }

        if (fs.existsSync(taskXmlFilePath)) {
            const xmlContent = fs.readFileSync(taskXmlFilePath, 'utf-8');

            // Parse XML content to a structured array
            const parser = new xml2js.Parser();
            const xmlData = await parser.parseStringPromise(xmlContent);
            issues.task = xmlData.issues.issue.map(issue => ({
                key: issue.key[0],
                issueLink1: issue.IssueLink1[0],
                issueLink2: issue.IssueLink2 ? issue.IssueLink2[0] : null,
                linkedissues1: issue.linkedissue1 ? issue.linkedissue1[0].split(',') : [],
                linkedissues2: issue.linkedissue2 ? issue.linkedissue2[0].split(',') : []
            }));
        }

        if (fs.existsSync(softwareXmlFilePath)) {
            const xmlContent = fs.readFileSync(softwareXmlFilePath, 'utf-8');

            // Parse XML content to a structured array
            const parser = new xml2js.Parser();
            const xmlData = await parser.parseStringPromise(xmlContent);
            issues.software = xmlData.issues.issue.map(issue => ({
                key: issue.key[0],
                issueLink1: issue.IssueLink1[0],
                issueLink2: issue.IssueLink2 ? issue.IssueLink2[0] : null,
                linkedissues1: issue.linkedissue1 ? issue.linkedissue1[0].split(',') : [],
                linkedissues2: issue.linkedissue2 ? issue.linkedissue2[0].split(',') : []
            }));
        }
    }

    // Check coverage of each issue type
    issues.customer = issues.customer.map(issue => ({
        ...issue,
        covered: issue.linkedissues1.some(key => issues.system.some(systemIssue => systemIssue.key === key)) || (issue.linkedissues2.length > 0 && issue.linkedissues2.some(key => issues.system.some(systemIssue => systemIssue.key === key)))
    }));

    issues.system = issues.system.map(issue => ({
        ...issue,
        covered: issue.linkedissues1.some(key => issues.task.some(taskIssue => taskIssue.key === key) || issues.software.some(softwareIssue => softwareIssue.key === key)) || (issue.linkedissues2.length > 0 && issue.linkedissues2.every(key => issues.task.some(taskIssue => taskIssue.key === key) || issues.software.some(softwareIssue => softwareIssue.key === key)))
      }));      

    issues.task = issues.task.map(issue => ({
        ...issue,
        covered: issue.linkedissues1.some(key => issues.software.some(softwareIssue => softwareIssue.key === key)) || (issue.linkedissues2.length > 0 && issue.linkedissues2.some(key => issues.software.some(softwareIssue => softwareIssue.key === key)))
    }));

    
    const SW = getSW(projectName);
    issues.software = checkSoftwareCoverage(issues.software, SW.SWAD.extracted, SW.SWDD.extracted)
    issues.swad = checkSWADCoverage(SW.SWAD.extracted,SW.SWDD.extracted)
    issues.customer=checkCycleCoverage(issues.customer,issues.system,issues.task,issues.software)
    res.json(issues);
};
//soft coverage
function checkSoftwareCoverage(softwareIssues, swadIssues, swddIssues) {
    return softwareIssues.map(issue => {
      const swadCovered = swadIssues.some(swadIssue => swadIssue.reference.includes(issue.key));
      const swddCovered = swddIssues.some(swddIssue => swddIssue.reference.includes(issue.key));
      return {
        ...issue,
        covered: swadCovered && swddCovered
      };
    });
  }
  
//swad coverage
function checkSWADCoverage(swadIssues, swddIssues) {
    return swadIssues.map(issue => {
      const swddCovered = swddIssues.some(swddIssue => swddIssue.reference.includes(issue.key));
      return {
        ...issue,
        covered: swddCovered
      };
    });
  }
//sw extract
const getSW = (name) => {

    const baseDirectory = path.join(path.resolve(), `./projects/${name}`);
    const result = {};
    const foldersToCheck = ['SWAD', 'SWDD'];

    for (const folder of foldersToCheck) {
        const folderPath = path.join(baseDirectory, folder);
        const metadataFilePath = path.join(folderPath, `${folder.toLowerCase()}_metadata.json`);
        const extractedFilePath = path.join(folderPath, `${folder.toLowerCase()}_extracted.json`);

        if (fs.existsSync(metadataFilePath) && fs.existsSync(extractedFilePath)) {
            const metadataContent = JSON.parse(fs.readFileSync(metadataFilePath, 'utf-8'));
            const extractedContent = JSON.parse(fs.readFileSync(extractedFilePath, 'utf-8'));

            let structuredExtractedContent;
            if (folder === 'SWDD') {
                structuredExtractedContent = structureSWDDJsonData(extractedContent);
            } else if (folder === 'SWAD') {
                structuredExtractedContent = structureSWADJsonData(extractedContent);
            }

            result[folder] = {
                metadata: metadataContent,
                extracted: structuredExtractedContent
            };
        }
    }
    return result
};
// Function to structure SWDD JSON data
function parseSWDDEntry(entry) {
    const lines = entry.split(/\n+/);
    const ID = lines[0] || null;
    const key = lines[1] || null;
    const description = lines.includes('Description') ? lines[lines.indexOf('Description') + 1] : null;
    const parameter = lines.includes('Parameter 1') ? lines[lines.indexOf('Parameter 1') + 1] : null;
    const returnValue = lines.includes('Return Value') ? lines[lines.indexOf('Return Value') + 1] : null;
    const precondition = lines.includes('Precondition') ? lines[lines.indexOf('Precondition') + 1] : null;
    const postCondition = lines.includes('Post condition') ? lines[lines.indexOf('Post condition') + 1] : null;
    const errorConditions = lines.includes('Error Conditions') ? lines[lines.indexOf('Error Conditions') + 1] : null;
    const reference = lines.find(line => line.startsWith('Ref')) || null;

    return {
        ID,
        key,
        description,
        parameter,
        returnValue,
        precondition,
        postCondition,
        errorConditions,
        reference
    };
}

function structureSWDDJsonData(inputData) {
    return inputData.map(entry => parseSWDDEntry(entry));
}

// Function to structure SWAD JSON data
function parseSWADEntry(entry) {
    // Split the entry into lines
    const lines = entry.split('\n').map(line => line.trim()).filter(line => line !== "");

    // Initialize structured JSON object
    const structuredJSON = {
        key: lines[0],
        reference: "",
        interfaceDetails: []
    };

    let inInterfaceDetails = false;
    let currentInterface = null;
    let summaryLines = []; // Array to store summary lines

    // Iterate through each line
    lines.forEach(line => {
        if (line === 'Provided Interface Details') {
            inInterfaceDetails = true;
            return;
        }

        if (!inInterfaceDetails) {
            summaryLines.push(line.replace(structuredJSON.key, ''));
        } else {
            if (line.startsWith('Ref:')) {
                structuredJSON.reference = line.match(/Ref:{([^}]*)}/)[1];
                inInterfaceDetails = false;
            } else {
                if (!currentInterface) {
                    currentInterface = {
                        interfaceName: line,
                        description: "",
                        parameters: "",
                        returns: "",
                        summary: summaryLines.join('\n') // Add summary field to currentInterface
                    };
                } else if (!currentInterface.description) {
                    currentInterface.description = line;
                } else if (!currentInterface.parameters) {
                    currentInterface.parameters = line;
                } else if (!currentInterface.returns) {
                    currentInterface.returns = line;
                    structuredJSON.interfaceDetails.push(currentInterface);
                    currentInterface = null;
                }
            }
        }
    });

    return structuredJSON;
}

function structureSWADJsonData(inputData) {
    return inputData.map(entry => parseSWADEntry(entry));
}
// cycle coverage
function checkCycleCoverage(customerIssues, systemIssues, taskIssues, softwareIssues) {
    const issueMap = {
      customer: customerIssues,
      system: systemIssues,
      task: taskIssues,
      software: softwareIssues
    };
  
    function getCycleIssues(issue, type, cycleIssues = []) {
      cycleIssues.push(issue);
  
      if (type === 'software') {
        return cycleIssues;
      }
  
      const nextType = type === 'customer' ? 'system' : type === 'system' ? 'task' : 'software';
      const linkedissues = type === 'customer' ? issue[`linkedissues1`] : issue[`linkedissues2`];
  
      return linkedissues.reduce((acc, key) => {
        const nextIssue = issueMap[nextType].find(issue => issue.key === key);
        return nextIssue && nextIssue.covered ? getCycleIssues(nextIssue, nextType, acc) : acc;
      }, cycleIssues);
    }
  
    return customerIssues.map(issue => {
      const cycleIssues = issue.covered ? getCycleIssues(issue, 'customer') : [];
      return {
        ...issue,
        cycleIssues,
        cycleCovered: cycleIssues.length > 0 && cycleIssues.every(issue => issue.covered)
      };
    });
  }
  
  
  