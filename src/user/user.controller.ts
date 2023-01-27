import { Controller, Get, Post, Patch, Body, Res, Query, Headers, BadRequestException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "./user.service"
import { Response } from 'express'

@Controller('chat-mate-api')

export class UserController {
    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    @Post('signup')
    async signup(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('pic') pic: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.userService.signup(name, email, password, pic)
        const jwt = await this.jwtService.signAsync({ id: user._id })
        res.cookie('chat-mate-jwt', jwt, { httpOnly: true })
        return {_id: user._id, name: user.name, email: user.email, pic: user.pic, online: user.online, lastOnline: user.lastOnline}
    }

    @Post('email')
    async email(
        @Body('email') email: string
    ) {
        if(!email || typeof(email) !== "string") {
            throw new BadRequestException("Missing required field: email [or] It must be a of type: string")
        } 
        await this.userService.email(email)
        return { message: "available" }
    }

    @Post('name')
    async name(
        @Body('name') name: string
    ) {
        if(!name || typeof(name) !== "string") {
            throw new BadRequestException("Missing required field: name [or] It must be a of type: string")
        } 
        await this.userService.name(name)
        return { message: "available" }
    }

    @Post('login') 
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.userService.login(email, password)
        const jwt = await this.jwtService.signAsync({ id: user._id })
        res.cookie('chat-mate-jwt', jwt, { httpOnly: true })
        return {_id: user._id, name: user.name, email: user.email, pic: user.pic, online: user.online, lastOnline: user.lastOnline}
    }

    @Patch('edit-profile')
    async editProfile(
        @Headers('id') id: string,
        @Body ('name') name: string,
        @Body ('pic') pic: string,
        @Body ('online') online: boolean
    ) {
        const user = await this.userService.EditProfile(id, online, name, pic)
        return {_id: user._id, name: user.name, email: user.email, pic: user.pic, online: user.online, lastOnline: user.lastOnline}
    }

    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response
    ) {
        res.clearCookie('chat-mate-jwt')
        return {
            message: "logout successful"
        }
    }

    @Get('search-user?')
    async searchUser(
        @Query('search') search: string,
        @Headers('id') id: string
    ) {
        const users = await this.userService.searchUser(search, id)
        return users
    }

}