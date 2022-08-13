class inputFormat {
    uuid: RegExp;
    text255requiredinput: RegExp;
    text255optionalinput: RegExp;
    emailinput: RegExp;
    text36requiredinput: RegExp;
    colorinput: RegExp;
    daterequiredinput: RegExp;
    timerequiredinput: RegExp;
    amountrequiredinput: RegExp;

    constructor() {
        this.uuid = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        this.text255requiredinput = /^[a-zA-Z0-9._ \t]{1,255}$/,
        this.text255optionalinput = /^[a-zA-Z0-9._ \t]{0,255}$/,
        this.emailinput = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,                                       // does not yet validate for email max length
        this.text36requiredinput = /^[a-zA-Z0-9._ \t]{1,36}$/,
        this.colorinput = /^(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)$/,
        this.daterequiredinput = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,
        this.timerequiredinput = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
        this.amountrequiredinput = /^\d{1,63}(\.\d{1,2})?$/
    };

    validateuuid(data: any) {
        if (typeof data === 'string') {
            return this.uuid.test(data);
        } else {
            return false;
        };
    };

    validatetext255requried(data: any) {
        if (typeof data === 'string') {
            return this.text255requiredinput.test(data);
        } else {
            return false;
        };
    };

    validatetext255optional(data: any) {
        if (typeof data === 'string') {
            return this.text255optionalinput.test(data);
        } else {
            return false;
        };
    };

    validateemail(data: any) {
        if ((typeof data === 'string') && (data.length <= 255)) {
            return this.emailinput.test(data);
        } else {
            return false;
        };
    };

    validatetext36required(data: any) {
        if (typeof data === 'string') {
            return this.text36requiredinput.test(data);
        } else {
            return false;
        };
    };

    validatecolor(data: any) {
        if (typeof data === 'string') {
            return this.colorinput.test(data);
        } else {
            return false;
        };
    };

    validatedate(data: any) {
        if (typeof data === 'string') {
            return this.daterequiredinput.test(data);
        } else {
            return false;
        };
    };

    validatetime(data: any) {
        if (typeof data === 'string') {
            return this.timerequiredinput.test(data);
        } else {
            return false;
        };
    };

    validateamount(data: any) {
        if (typeof data === 'number') {
            return this.timerequiredinput.test(String(data));
        } else {
            return false;
        };
    }

    validatetextblock(data: any) {
        if ((typeof data === 'string') && (data.length <= 65535)) {
            return true;
        } else {
            return false;
        };
    };
}

export default inputFormat