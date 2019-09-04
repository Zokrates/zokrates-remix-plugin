class LocalStorageManager {

    __prefix: string = "zokrates:";

    setItem(key: string, value: any) {
        const _key = this.__prefix.concat(key);
        localStorage.setItem(_key, value);
    }

    getItem(key: string) {
        const _key = this.__prefix.concat(key);
        return localStorage.getItem(_key);
    }
}

export const storageManager = new LocalStorageManager();