import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, UDPServer } from '@remote-kakao/core';
import { Model } from 'mongoose';
import { Count, User } from './schemas/user.schemas';
const schedule = require('node-schedule');

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async user(client: UDPServer) {
        client.on("message", async (message) => {
            try {
                const userId = message.sender.hash
                const userInfo = await this.userfindOne(userId);

                if (!userInfo) {
                    await this.userCreate(message)
                }
                if (userInfo !== null) {
                    const name = message.sender.name !== userInfo.name[0] ? [message.sender.name, ...userInfo.name] : userInfo.name
                    const newUserData: Partial<User> = {
                        name: name,
                        count: {
                            day: userInfo.count.day + 1,
                            month: userInfo.count.month + 1,
                            allDays: userInfo.count.allDays + 1,
                        },
                    };
                    await this.updateUser(userId, newUserData)
                }
            } catch (error) {
                Logger.error(error.message, error.stack);
            }
        });
    }

    // create //

    async userCreate(message: Message): Promise<User> {
        try {
            const defaultUser: User = new this.userModel({
                name: [message.sender.name],
                serialNum: message.sender.hash,
                count: {
                    day: 1,
                    month: 1,
                    allDays: 1,
                },
                role: "",
            });
            return await defaultUser.save();
        } catch (error) {
            Logger.error(error.message, error.stack);
        }
    }
    // get //

    async userfindOne(serialNum: string): Promise<User | null> {
        try {
            const user = await this.userModel.findOne({ serialNum }).exec();
            return user;
        } catch (error) {
            Logger.error(error.message, error.stack);
            return null;
        }
    }

    // update //

    async updateUser(serialNum: string, updatedFields: Partial<User>) {
        try {
            const updateQuery = { $set: updatedFields };
            await this.userModel.updateOne({ serialNum }, updateQuery);
        } catch (error) {
            Logger.error('Error updating user:', error);
        }
    }

    resetDayCount = async () => {
        try {
            const updateFields = {
                'count.day': 0,
            };
            await this.userModel.updateMany({}, updateFields);
            Logger.log('매일 자정에 day 초기화가 수행되었습니다.');
        }
        catch (error) {
            Logger.error(error.message, error.stack);
        }
    }

    resetMonthCount = async () => {
        try {
            const updateFields = {
                'count.month': 0,
            };
            await this.userModel.updateMany({}, updateFields);
            Logger.log('매달 1일 00시에 day 초기화가 수행되었습니다.');
        }
        catch (error) {
            Logger.error(error.message, error.stack);
        }
    }

}
