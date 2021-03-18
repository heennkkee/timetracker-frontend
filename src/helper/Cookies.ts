// Shamelessly borrowed https://gist.github.com/joduplessis/7b3b4340353760e945f972a69e855d11, and slightly modified..

class Cookies {
    static set(name: string, val: string, durationHours: number = 24, path: string = "/") {
        const date = new Date();
        const value = val;
    
        date.setTime(date.getTime() + (durationHours * 60 * 60 * 1000));
    
        // Set it
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=${path}`;
    }

    static get(name: string, defValue: string | undefined = undefined) {

        let parts;
        if (document.cookie.indexOf(';') > -1) {
            parts = document.cookie.split("; " + name + "=");
        } else {
            parts = document.cookie.split("=");
        }
        
        
        if (parts.length === 2) {
            let val = parts.pop();
            if (val !== undefined) {
                return val;
            }
        }
    }

    static delete(name: string, path: string = "/") {
        const date = new Date();

        // Set it expire in -1 days
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    
        // Set it
        document.cookie = `${name}=; expires=${date.toUTCString()}; path=${path}`;
    }
}

export default Cookies