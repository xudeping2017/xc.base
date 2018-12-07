'use strict';
const Controller = require('xc.base').DbController;
const fs = require('fs')
const path = require('path')
class xcApiController extends Controller {
    /**
     * @api {POST} /xcApi 0.0 创建API
     * @apiName  0.0 创建API
     * 
     * @apiParam {string} table 表名
     * @apiParam {string} prefix 接口前缀
     * @apiParam {string} [apiNum] api编号(默认'a1')
     * @apiParam {string} [db] 数据库名(默认this.app.config.mysql.clients.db1.database)
     * @apiParam {string} [basePrefix] 上下文根(默认this.app.config.static.prefix)
     * 
     * @apiGroup 0.0 xcApi
     * @apiVersion 1.0.0
     * 
     * @apiUse Error0
     * @apiUse Error1
     * */
    async create(){
        this.validate({
            table:{type:'string'}
        },this.ctx.request.query)
        const prefix = this.ctx.params.prefix
        const table = this.ctx.request.query.table 
        const apiNum = this.ctx.request.query.apiNum || 'a1'
        const db = this.ctx.request.query.db || this.app.config.mysql.clients.db1.database
        const basePrefix = (this.ctx.request.query.basePrefix || this.app.config.static.prefix)||''
        const tableInfo = await this.doQueryError(`
            SELECT TABLE_COMMENT FROM information_schema.TABLES 
            WHERE table_schema=${this.to(db)} AND TABLE_NAME = ${this.to(table)}
        `)
        if(tableInfo.length ==0){
            throw new this.app.serverError('表不存在')
        }
        const tableDesc = tableInfo[0].TABLE_COMMENT
        const cols = await this.doQueryError(`SELECT COLUMN_NAME,IS_NULLABLE,DATA_TYPE,COLUMN_COMMENT,COLUMN_KEY
        FROM
            information_schema. COLUMNS
        WHERE
            TABLE_SCHEMA = ${this.to(db)}
        AND TABLE_NAME =  ${this.to(table)}
        `)
        let apiParams = ``
        let apiParamsCreate = ``
        let apiListRes = ``
        let validate = {}
        let insert = ``
        let createP = ``
        let insertValues = ``
        let duplicate = ``
        let updateValues=``
        for(let col of cols){
            apiParams+=`\t * @apiParam {${["int","integer","bigint"].includes(col.DATA_TYPE)?'number':'string'}} ${col.IS_NULLABLE=='YES'?'[':''}payload.${col.COLUMN_NAME}${col.IS_NULLABLE=='YES'?']':''} ${col.COLUMN_COMMENT}`
            apiParams+='\n'
            apiListRes+=`\t * @apiSuccess {${["int","integer","bigint"].includes(col.DATA_TYPE)?'number':'string'}} Error0.content.${col.COLUMN_NAME} ${col.COLUMN_COMMENT}`
            apiListRes+='\n'
            if(col.COLUMN_KEY!='PRI'){
                apiParamsCreate+=`\t * @apiParam {${["int","integer","bigint"].includes(col.DATA_TYPE)?'number':'string'}} ${col.IS_NULLABLE=='YES'?'[':''}payload.${col.COLUMN_NAME}${col.IS_NULLABLE=='YES'?']':''} ${col.COLUMN_COMMENT}`
                apiParamsCreate+='\n'
                insert+=','
                insert+=col.COLUMN_NAME
                insertValues+=','
                insertValues+=`\${this.to(info.${col.COLUMN_NAME})}`
                updateValues+=`,${col.COLUMN_NAME}=\${this.to(info.${col.COLUMN_NAME})}`
                if(col.IS_NULLABLE=='NO'){
                    validate[col.COLUMN_NAME]={type:["int","integer","bigint"].includes(col.DATA_TYPE)?'number':'string'}
                }else{
                    createP+= `\t\tinfo.${col.COLUMN_NAME} = info.${col.COLUMN_NAME} || null\n`
                }
            }
            if(['MUL','UNI'].includes(col.COLUMN_KEY)){
                duplicate+=`\t\t\tif(error && error.info && error.info.indexOf('Duplicate')>-1 && error.info.indexOf('${col.COLUMN_NAME}')>-1){
                    throw new this.app.dbError('${col.COLUMN_COMMENT}已存在!');
                }\n`
            }
        }
        apiParams=apiParams.replace(/(^\s*)|(\s*$)/g, "")
        apiParamsCreate=apiParamsCreate.replace(/(^\s*)|(\s*$)/g, "")
        apiListRes=apiListRes.replace(/(^\s*)|(\s*$)/g, "")
        createP=createP.replace(/(^\s*)|(\s*$)/g, "");
        updateValues=updateValues.replace(/(^\s*)|(\s*$)/g, "");
        duplicate=duplicate.replace(/(^\s*)|(\s*$)/g, "");
        insert =insert.substr(1)
        updateValues =updateValues.substr(1)
        insertValues =insertValues.substr(1)
        let controllerInfo =
`'use strict';

const Controller = require('xc.base').BaseController;

class ${prefix.charAt(0).toUpperCase()+prefix.substr(1)}Controller extends Controller {
    /**@apiIgnore
     * @api {POST} ${basePrefix+'v1.0.0/'+prefix} ${apiNum}.1创建${tableDesc}
     * @apiName  ${apiNum}.1创建${tableDesc}
     * 
     * @apiParam {object} header 公共参数
     * @apiParam {string} header.appKey key
     * @apiParam {string} header.accessToken token
     * @apiParam {string} header.time 时间戳
     * @apiParam {string} header.sign 签名
     * 
     * @apiParam {object} payload 消息体
     ${apiParamsCreate}
     * 
     * @apiGroup ${apiNum+' '+prefix}
     * @apiVersion 1.0.0
     * 
     * @apiUse Error0
     * @apiUse Error1
     * */
    async create(){
        this.validate(${JSON.stringify(validate,2,0)})
        try{
            const result = await this.ctx.service.${prefix}.create(this.ctx.request.body)
            if(result.affectedRows === 0){
                throw new this.app.serverError('添加失败!');
            }
            this.success(result.insertId)
        }catch(error){
            ${duplicate}
            throw(error);
        }
    }
    /**@apiIgnore
     * @api {GET} ${basePrefix+'v1.0.0/'+prefix} ${apiNum}.2查找${tableDesc}
     * @apiName  ${apiNum}.2查找${tableDesc}
     * 
     * @apiParam {string} appKey key
     * @apiParam {string} accessToken token
     * @apiParam {string} time 时间戳
     * @apiParam {string} sign 签名
     * 
     * @apiGroup ${apiNum+' '+prefix}
     * @apiVersion 1.0.0
     * 
     * @apiUse Error0
     ${apiListRes}
     * @apiUse Error1
     * */
    async list(){
        this.success(await this.ctx.service.${prefix}.list())
    }
    /**@apiIgnore
     * @api {PUT} ${basePrefix+'v1.0.0/'+prefix} ${apiNum}.3更新${tableDesc}
     * @apiName  ${apiNum}.3更新${tableDesc}
     * 
     * @apiParam {object} header 公共参数
     * @apiParam {string} header.appKey key
     * @apiParam {string} header.accessToken token
     * @apiParam {string} header.time 时间戳
     * @apiParam {string} header.sign 签名
     * @apiParam {object} payload 消息体
     ${apiParams}
     * 
     * @apiGroup ${apiNum+' '+prefix}
     * @apiVersion 1.0.0
     * 
     * @apiUse Error0
     * @apiUse Error1
     * */
    async update(){
        this.validate(${JSON.stringify(validate,2,0)})
        try{
            const result = await this.ctx.service.${prefix}.update(this.ctx.request.body)
            if(result.affectedRows === 0){
                throw new this.app.serverError('更新失败!');
            }
            this.success([])
        }catch(error){
            ${duplicate}
            throw(error);
        }
    }
    /**@apiIgnore
     * @api {DELETE} ${basePrefix+'v1.0.0/'+prefix}/:id ${apiNum}.4删除${tableDesc}
     * @apiName  ${apiNum}.4删除${tableDesc}
     * 
     *  @apiParam {string} appKey key
     *  @apiParam {string} accessToken token
     *  @apiParam {string} time 时间戳
     *  @apiParam {string} sign 签名
     *  @apiParam {string} id  id
     * 
     * @apiGroup ${apiNum+' '+prefix}
     * @apiVersion 1.0.0
     * 
     * @apiUse Error0
     * @apiUse Error1
     * */
    async del(){
        this.validate(
            {
                id : {type:"string"}
            },this.ctx.params
        )
        await this.ctx.service.${prefix}.del(this.ctx.params.id)
        this.success([])
    } 
}
module.exports = ${prefix.charAt(0).toUpperCase()+prefix.substr(1)}Controller; `
       controllerInfo = controllerInfo.replace(/@apiIgnore/g, "")
       fs.writeFileSync(path.join(__dirname,`${prefix}.js`),controllerInfo)


    const serviceInfo = 
`'use strict';

const Service = require('xc.base').DbService;

class ${prefix.charAt(0).toUpperCase()+prefix.substr(1)}Service extends Service {
    async create(info){
        ${createP}
        return  await this.doQueryError(
                \`insert into ${table}(${insert}) 
                values(${insertValues})\`
            )
    }
    async list(){
        return await this.doQuery(
            \`select * from ${table}\`
        )
    }
    async update(info){
        ${createP}
        return await this.doQueryError(
            \`update ${table} set ${updateValues} where id=\${this.to(info.id)}\`
        )
    }
    async del(id){
        return await this.doQueryError(
            \`delete from ${table} where id=\${this.to(id)}\`
        )
    }
}
module.exports = ${prefix.charAt(0).toUpperCase()+prefix.substr(1)}Service;`
    fs.writeFileSync(path.join(__dirname,`../service/${prefix}.js`),serviceInfo)

    let router = fs.readFileSync(path.join(__dirname,`../router.js`)).toString()

    router = router.replace(/(^\s*)|(\s*$)/g, "")
    if(router.indexOf(`router.post('${basePrefix+'v1.0.0/'+prefix}', controller.${prefix}.create)`)===-1){
        router = router.substr(0,router.lastIndexOf('}'))
        router = 
`${router}
  router.post('${basePrefix+'v1.0.0/'+prefix}', controller.${prefix}.create)
  router.get('${basePrefix+'v1.0.0/'+prefix}', controller.${prefix}.list)
  router.put('${basePrefix+'v1.0.0/'+prefix}', controller.${prefix}.update)
  router.delete('${basePrefix+'v1.0.0/'+prefix+'/:id'}', controller.${prefix}.del)
};`
    fs.writeFileSync(path.join(__dirname,`../router.js`),router)
    }
   
       this.success([])
    }
}
module.exports = xcApiController;