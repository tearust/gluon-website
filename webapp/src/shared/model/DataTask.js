


export default class {

  data_buf = null;
  data_cid = null;

  description = null;
  price_plan = null;

  constructor(buf, description, price_plan="A"){
    this.data_buf = buf;
    this.description = description;
    this.price_plan = price_plan;

    this.initData();
  }

  initData(){

  }

  async build(){

  }
}