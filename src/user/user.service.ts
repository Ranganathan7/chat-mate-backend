import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserType } from "src/schemas/user.schema";
import * as bcrypt from "bcrypt"
import { UserAlreadyExistsException } from "./user.exception";

@Injectable()

export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserType>
        ) {}

    async signup(name: string, email: string, password: string, pic: string):  Promise<UserType>{
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = {
            name: name,
            email: email,
            password: hashedPassword,
            pic: pic
        }
        const existingUser = await this.userModel.findOne({ $or: 
            [
                {email: email},
                {name: name}
            ]
        })
        if(existingUser) {
            throw new UserAlreadyExistsException("User with given email or name already exists")
        }
        return await this.userModel.create(user)
    }

    async email(email: string): Promise<void> {
        const user = await this.userModel.findOne({ email: email })
        if(user) {
            throw new UserAlreadyExistsException("User with email: " + email + " already exists")
        }
    }

    async name(name: string): Promise<void> {
        const user = await this.userModel.findOne({ name: name })
        if(user) {
            throw new UserAlreadyExistsException("User with name: " + name + " already exists")
        }
    }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email: email })
        if(!user){
            throw new NotFoundException("Invalid Credentials")
        }
        if(!await bcrypt.compare(password, user.password)) {
            throw new NotFoundException("Invalid Credentials")
        }
        return user
    }

    async EditProfile(id: string, online: boolean, name: string, pic: string): Promise<UserType> {
        if(name.length > 0) return await this.changeName(id, name)
        else if(pic.length > 0) return await this.changePic(id, pic)
        else return await this.changeOnline(id, online)
    }

    private async changeOnline(id: string, online: boolean): Promise<UserType> {
        if(!online) {
            const updatedUser = await this.userModel.findByIdAndUpdate(id, { $set: {online: online, lastOnline: Date.now()}}, {new: true})
            if(!updatedUser) throw new NotFoundException("User Not Found")
            return updatedUser
        }
        else {
            const updatedUser = await this.userModel.findByIdAndUpdate(id, { $set: {online: online}}, {new: true})
            if(!updatedUser) throw new NotFoundException("User Not Found")
            return updatedUser
        }
    }

    private async changeName(id: string, name: string): Promise<UserType> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, { $set: {name: name}}, {new: true})
        if(!updatedUser) throw new NotFoundException("User Not Found")
        return updatedUser
    }

    private async changePic(id: string, pic: string): Promise<UserType> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, { $set: {pic: pic}}, {new: true})
        if(!updatedUser) throw new NotFoundException("User Not Found")
        return updatedUser
    }
    
    async searchUser(search: string, id: string): Promise<UserType[]> {
        const searchKeyword = (!search || search === "") ? {} : {name: { $regex: search, $options: "i" }}
        const users = await this.userModel.find(searchKeyword, { password: 0 }).find({ _id: { $ne: id }}).collation({locale: "en"}).sort({"name": 1})
        return users
    }
} 