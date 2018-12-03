'use strict';
const fs = require('fs')
const path = require('path')
module.exports = async function(app){
  if(!fs.existsSync(path.join(__dirname, '../../../app/controller/xcApi.js'))){
      fs.writeFileSync(path.join(__dirname, '../../../app/controller/xcApi.js'),fs.readFileSync(path.join(__dirname,'./xcApi.js')).toString());
    }
    let router = fs.readFileSync(path.join(__dirname,`../../../app/router.js`)).toString()
      router = router.replace(/(^\s*)|(\s*$)/g, "")
      let routerChanged = false;
      if(router.indexOf(`@apiDefine`)===-1){
        routerChanged = true;
          router = router.split(`use strict';`)[1]
          router = 
`'use strict';
/**
 * @apiDefine  Error0
 * @apiSuccess {string} Error0.code=0 错误码
 * @apiSuccess {string} Error0.message=Success 错误信息!
 */

/**
 * @apiDefine  Error1
 * @apiError {string} Error1.code
 * 10000:鉴权相关。
 * 20000:数据库相关。
 * 30000:服务端逻辑。
 * 10001:jwt 验证错误。
 * 10002:oauth 验证错误。
 * 10003:参数验证错误。
 * 20001:redis Error错误码。
 * @apiError {string} Error1.message=xxx 错误信息!
 * @apiError {object} Error1.info=xxx 错误内容!
 */
${router}`
      }
      const apiRouter = `router.get('/xcApi/:prefix', controller.xcApi.create)`
      if(router.indexOf(apiRouter)===-1){
        routerChanged = true
        router = router.substr(0,router.lastIndexOf('}'))
        router = 
`${router}
  ${apiRouter}
};`
    }
    if(routerChanged){
        fs.writeFileSync(path.join(__dirname,`../../../app/router.js`),router)
    }
    if(!fs.existsSync(path.join(__dirname, '../../../apidoc.json'))){
        fs.writeFileSync(path.join(__dirname, '../../../apidoc.json'),JSON.stringify({
              "name": app.config.name,
              "version": "1.0.0",
              "description": `api doc for ${app.config.name}`,
              "apidoc": {
                "title": `api doc for ${app.config.name}`,
                "url" : "http://localhost:7001"
              }
        },2,2))
    }
}
