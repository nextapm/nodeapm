import fs from 'fs';
import path from 'path';
import { isEmpty } from './helper';

let writeStream;

const getWriteStream = () => {
  if (writeStream) {
    return writeStream;
  }
  const dir = path.join(process.cwd(), 'nodeapmdata');
  try{
    
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    const date = new Date();
    const dateStr = `${date.getDate()}_${date.getMonth()+1}_${date.getFullYear()}`; 
    const filePath = path.join(dir, `nodeapm_agent_logs_${dateStr}.log`);
    const fd = fs.openSync(filePath, 'a');
    writeStream = fs.createWriteStream(null, {flags:'a',fd: fd});
    writeStream.on('error', () => void 0);
  } catch(e) {
    console.log(`Not able to create apminsight agent logs in ${dir}`);
    writeStream = process.stdout;
  }
  return writeStream;
}

export const write = (level: string, message: string, obj: any) => {
  const stream = getWriteStream();
  const writeStr = `${getTime()} [${level}] ${message} ${stringify(obj)}\n`;
  stream.write(writeStr);
}

const getTime = () => {
  const date = new Date();
  const month = date.getMonth()+1;
  return `[${date.getDate()}/${month}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
}

const stringify = (obj) => {
  try{
    if(isEmpty(obj)){
      return '';
    }
    if(obj instanceof Error) {
      return obj.stack;
    }

    return JSON.stringify(obj);
  }catch(e){
    return '';
  }
}
