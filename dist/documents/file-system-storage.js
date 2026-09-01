"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemStorage = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const storage_port_1 = require("./storage-port");
let FileSystemStorage = class FileSystemStorage extends storage_port_1.StoragePort {
    async save(input, documentId) {
        const baseDir = (0, path_1.join)(process.cwd(), 'storage', 'documents');
        await (0, promises_1.mkdir)(baseDir, { recursive: true });
        const targetPath = (0, path_1.join)(baseDir, `${documentId}-${input.originalname}`);
        await (0, promises_1.writeFile)(targetPath, input.buffer);
        return { path: targetPath };
    }
    async read(path) {
        return (0, promises_1.readFile)(path);
    }
};
exports.FileSystemStorage = FileSystemStorage;
exports.FileSystemStorage = FileSystemStorage = __decorate([
    (0, common_1.Injectable)()
], FileSystemStorage);
//# sourceMappingURL=file-system-storage.js.map