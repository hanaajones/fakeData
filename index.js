const faker = require('faker')
const fs = require('fs');
const $ = require('jquery');

let everyOther = true
let parentId = 0;
let parentIdNull = null;
let id = 0

const generateUser = () => {
  let username = faker.internet.userName();
  let imageUrl = faker.image.imageUrl();
  return `${username}\tnull`
}

const generateData = () => {
  let text = faker.lorem.sentence();
  if (everyOther === true) {
    let type = 1
    everyOther = false;
    id++
    return `${id}\t1\t2\t${text}\t${type}\tnull\t3\t`;
  } else {
    let type = 2
    everyOther = true;
    parentId++
    id++
    return `${id}\t1\t2\t${text}\t${type}\t${parentId}\t3`;
  }
}


function writeData(writer, func, callback) {
  let i = 1e7;
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        let data = func()
        writer.write(data + '\n');
        callback()
      } else {
        let data = func()
        ok = writer.write(data + '\n');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
}


const writer = fs.createWriteStream('data.tsv');
console.time('Data GenerationQ')
writeData(writer, generateData, () => {
  console.timeEnd('Data GenerationQ');
  console.log('Done writing to file');
});

const writer1 = fs.createWriteStream('user.tsv');
console.time('DataGenerationUser')
writeData(writer1, generateUser, () => {
  console.timeEnd('DataGenerationUser');
  console.log('Done writing to file');
});
