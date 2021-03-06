// Shamelessly borrowed https://gist.github.com/joduplessis/7b3b4340353760e945f972a69e855d11, and slightly modified..

class Cookies {
    static set(name: string, val: string, durationHours: number = 24, path: string = "/") {
        const date = new Date();
        const value = val;
    
        date.setTime(date.getTime() + (durationHours * 60 * 60 * 1000));
    
        // Set it
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=${path}`;
    }

    static get(name: string) {

        let cookies = document.cookie.split("; ");

        for (let ix in cookies) {
            if (cookies[ix].indexOf(`${name}=`) > -1) {
                let parts = cookies[ix].split("=");
                let val = parts.pop();
                return val;
            }
        }
    }

    static delete(name: string, path: string = "/") {
        // Set it
        document.cookie = `${name}=; Max-Age=-1; path=${path}`;
    }
}

export default Cookies