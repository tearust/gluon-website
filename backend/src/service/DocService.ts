import Base from './Base';
import {_} from '../utility';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {DOC_DIR} from '../config';

const IGNORE_FILES = ['.git', '.github', '.gitignore', 'res', 'tpl', 'README.md', 'config.yaml'];

const doc = {
  replaceName(name){
    // return name.replace(/\.md$/ig, '').replace(/ /g, '-').replace(/\./g, '-');
    return name.replace(/\.md$/ig, '');
  },
  async getListSortFile(key='sort'): Promise<any> {
    const path = DOC_DIR+'/config.yaml';
    const text = fs.readFileSync(path, {
      encoding: 'utf-8'
    });

    return new Promise(resolve => {
      yaml.safeLoadAll(text, (doc) => {
        resolve(doc[key]);
      });

    });
  },
  async dir(dir_path, relative_dir=""){
    let files = fs.readdirSync(dir_path);
    const rs_list = [];
    
    _.each(files, async (file)=>{
      if(_.includes(IGNORE_FILES, file)) return;
      const path = dir_path+'/'+file;
      const relative_path = relative_dir+'/'+file;
      const stat = fs.statSync(path);
      if(stat.isFile()){
        if(!/\.md$/i.test(file)) return;
        rs_list.push({
          name: doc.replaceName(file),
          ori_name: file,
          path: relative_path
        })
      }
      else if(stat.isDirectory()){
        rs_list.push({
          name: doc.replaceName(file),
          ori_name: file,
          children: await doc.dir(path, relative_path)
        });
      }
    });

    return rs_list;
  },

  sortList(tar, src){
    const rs = _.map(tar, (item)=>{
      const tmp = _.find(src, (x)=>(x.ori_name === item.name));
      
      if(!item.children){
        if(tmp){
          item.path = tmp.path;
          item.name = tmp.name.replace(/_/g, ' ');

          return item;
        }
      }
      else{
        if(tmp){
          item.children = doc.sortList(item.children, tmp.children || []);
          item.name = tmp.name.replace(/_/g, ' ');
          return item;
        }
      }

      return null;
    });

    return _.filter(rs);
  }
};

export default class extends Base {
  async getMdFileList(): Promise<any> {
    const list = await doc.dir(DOC_DIR);
    let sort_list = await doc.getListSortFile('sort');
    sort_list = doc.sortList(sort_list, list);
console.log(11, sort_list)
    return sort_list;
  }

  async getMdFileContent(relative_path): Promise<any> {
    const full_path = DOC_DIR+'/'+relative_path;
    return fs.readFileSync(full_path, {
      encoding: 'utf-8'
    });
  }

  async getDockerComposeFileByName(name): Promise<string>{
    const path = DOC_DIR+'/tpl/'+name+'.yaml';
    return fs.readFileSync(path, {
      encoding: 'utf-8'
    });
  }

  


};