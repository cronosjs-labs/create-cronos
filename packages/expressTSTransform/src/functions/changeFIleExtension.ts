const fs = require('fs');

const changeFileExtension = (filePath: string) => {
    const newFile = filePath.replace(/.js$/, '.ts');
    fs.renameSync(filePath, newFile);
};

export default changeFileExtension;