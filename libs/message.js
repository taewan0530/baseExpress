/**
 * 참조하기..
 * http://blog.remotty.com/blog/2014/01/28/lets-study-rest/#status
 * http://spoqa.github.io/2013/06/11/more-restful-interface.html
 *
 * message관리하는 js파일.
 * client에서 toast 형식으로 message를 출력해줄때 사용하자.
 * @type {number}
 */

global._CODE_STATUS = {
    /**
     * 200
     * 클라이언트의 요청을 정상적으로 수행하였을때 사용합니다.
     * 응답 바디(body)엔 요청과 관련된 내용을 넣어줍니다.
     * 그리고 200의 응답 바디에 오류 내용을 전송하는데 사용해서는 안된다고 합니다.
     * 오류가 났을땐 40x 응답 코드를 권장합니다.
     */
    SUCESS: 200,

    /**
     * 201
     * 클라이언트가 어떤 리소스 생성을 요청하였고, 해당 리소스가 성공적으로 생성되었을때 사용합니다.
     */
    SUCESS_CREATED: 201,

    /**
     * 202
     * 대체로 처리 시간이 오래 걸리는 비동기 요청에 대한 응답으로 사용됩니다.
     * 즉, 이 요청에 대한 응답이 결과를 포함하지 않을 수 있다는 것이죠.
     * 하지만 최소한 응답 헤더나 응답데이터에 해당 처리를
     * 모니터링할 수 있는 리소스 페이지를 안내하거나 혹은
     * 해당 리소스가 처리되기까지의 예상 경과 시간 따위를
     * 안내하는 것이 더 좋은 설계라고 할 수 있겠습니다.
     */
    SUCESS_ACCEPTED: 202,

    /**
     * 204
     * 클라이언트의 요청응 정상적으로 수행하였을때 사용합니다.
     * 200과 다른점은 204는 응답 바디가 없을때 사용합니다.
     * 예를들어 DELETE와 같은 요청시에 사용합니다.
     * 클라이언트의 리소스 삭제요청이 성공했지만 부가적으로 응답 바디에 넣어서 알려줄만한 정보가 하나도 없을땐 204를 사용합니다.
     */
    SUCESS_NOTIONG: 204,

    /**
     * 400
     * 일반적인 요청실패에 사용합니다.
     * 대체로 서버가 이해할 수 없는 형식의 요청이 왔을 때 응답하기 위해 사용됩니다.
     * 무턱대고 400에러를 응답으로 주지 말고,
     * 다른 4XX대의 코드가 더 의미를 잘 설명할 수 있는지에 대하여 고민해야 합니다.
     */
    FAIL_BAD_REQUEST: 400,

    /**
     * 401
     * 말 그대로 리소스 접근 권한을 가지고 있지 않다는 것을 의미하기 위한 응답코드입니다.
     * 리소스를 획득하기 위하여 요청자는 인증에 필요한 헤더(가령 Authorization 헤더 같은)나 데이터를 첨부해야 할 것입니다.
     * 필요한 헤더나 데이터는 서버 쪽에서 요구하는 스펙을 충실히 따라야겠지요.
     */
    FAIL_UNAUTHORIZED: 401,

    /**
     * 409
     * 요청의 형식에는 문제가 없지만 리소스 상태에 의하여 해당 요청 자체를 수행할 수 없는 경우의 응답코드입니다.
     * 즉, 이미 삭제된 리소스를 또 삭제한다든가 비어있는 리스트에서 무언가를 요청한다든가 하는 모순된 상황을 생각해보면 되겠습니다.
     * 응답으로는 그 방법을 어떻게 해결할 수 있을지에(혹은 문제가 무엇인지) 대한 힌트가 포함되면 좋을 것입니다.
     */
    FAIL_CONFLICT: 409,


    successCode: 900,
    infoCode: 901,
    warningCode: 902,
    dangerCode: 903
};

function ResponseMessage(msg_code, json) {
    var res = this;
    res.status(msg_code);
    res.json(json);
}

function ResponseSucess(msg, data) {
    var res = this;

    ResponseMessage.call(res, _CODE_STATUS.SUCESS, {
        message: res.__(msg),
        data: data
    });
}

function ResponseCreated(data) {
    var res = this;

    ResponseMessage.call(res, _CODE_STATUS.SUCESS_CREATED, {
        data: data
    });
}

function ResponseNoting() {
    var res = this;
    ResponseMessage.call(res, _CODE_STATUS.SUCESS_NOTIONG, {});
}

function ResponseUnauthorized(msg) {
    var res = this;

    if (msg == undefined) {
        msg = "You need to log in";
    }

    ResponseMessage.call(res, _CODE_STATUS.FAIL_UNAUTHORIZED, {
        message: res.__(msg)
    });

}

function ResponseError(error) {
    var res = this;
    var errors = [];
    //메시지면 전달하는 에러일경우에..
    if (typeof error === 'string' || error instanceof String) {
        errors.push({
            message: res.__(error),
            path: '',
            type: 'string'
        });
    }
    else {
        var _errors = error.errors,
            err;
        for (var i = 0; i < _errors.length; i++) {
            err = Object.permit(_errors[i], ['message', 'path', 'type']);
            if ('message' in err)
                err.message = res.__(err.message);

            errors.push(err);
        }
    }

    ResponseMessage.call(res, _CODE_STATUS.FAIL_CONFLICT, {
        errors: errors
    });
}

module.exports.initMessage = function paramsInit(request, response, next) {
    if (typeof response === 'object') {
        response.renderError = ResponseError.bind(response);
        response.renderSucess = ResponseSucess.bind(response);
        response.renderCreated = ResponseCreated.bind(response);
        response.renderNotiong = ResponseNoting.bind(response);
        response.renderUnauthorized = ResponseUnauthorized.bind(response);
    }

    if (typeof next === 'function') {
        next();
    }
};
