import RNFS from 'react-native-fs';

export default async ({folderName, fileName, extention}) => {
  try {
    let count = 1;
    let FName = fileName;
    const folderPath = `${RNFS.DownloadDirectoryPath}/image-converter-king/${folderName}`;
    const folderExists = await RNFS.exists(folderPath);
    if (!folderExists) {
      await RNFS.mkdir(folderPath);
    }

    let filePath = `${folderPath}/${FName}`;
    let fileExists = await RNFS.exists(`${filePath}.${extention}`);

    while (fileExists) {
      FName = fileName;
      FName = `${FName} (${count})`;
      filePath = `${folderPath}/${FName}`;
      fileExists = await RNFS.exists(`${filePath}.${extention}`);
      count++;
    }

    filePath = `${filePath}.${extention}`;
    return filePath;
  } catch (error) {
    console.error('Error creating folder or writing file:', error);
    return null;
  }
};
