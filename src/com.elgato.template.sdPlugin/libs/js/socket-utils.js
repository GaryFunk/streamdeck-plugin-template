class SocketUtilities {
    /**
     * Returns error message for code
     * @param code
     */
    static getErrorMessage(code) {
        switch (code) {
            case 1000:
                return 'Normal Closure. The purpose for which the connection was established has been fulfilled.';
            case 1001:
                return 'Going Away. An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
            case 1002:
                return 'Protocol error. An endpoint is terminating the connection due to a protocol error';
            case 1003:
                return "Unsupported Data. An endpoint received a type of data it doesn't support.";
            case 1004:
                return '--Reserved--. The specific meaning might be defined in the future.';
            case 1005:
                return 'No Status. No status code was actually present.';
            case 1006:
                return 'Abnormal Closure. The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
            case 1007:
                return 'Invalid frame payload data. The connection was closed, because the received data was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629]).';
            case 1008:
                return 'Policy Violation. The connection was closed, because current message data "violates its policy". This reason is given either if there is no other suitable reason, or if there is a need to hide specific details about the policy.';
            case 1009:
                return 'Message Too Big. Connection closed because the message is too big for it to process.';
            case 1010:
                return 'Mandatory Extension. Connection is terminated the connection because the server didn\'t negotiate one or more extensions in the WebSocket handshake.';
            case 1011:
                return 'Internl Server Error. Connection closed because it encountered an unexpected condition that prevented it from fulfilling the request.';
            case 1015:
                return 'TLS Handshake. The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).';
            default:
                return 'Unknown reason';
        }
    }
}

var SocketUtils = SocketUtilities;
