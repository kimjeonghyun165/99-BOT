// Rooms.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Room } from './schemas/room.schemas';
import { RoomService } from './room.service';

@Controller('Room')
export class RoomController {
    constructor(private readonly RoomsService: RoomService) { }

    // @Post()
    // async create(@Body() Room: Room): Promise<Room> {
    //     return this.RoomsService.create(Room);
    // }

    // @Get()
    // async findAll(): Promise<Room[]> {
    //     return this.RoomsService.findAll();
    // }

    // @Get(':id')
    // async findOne(@Param('id') id: string): Promise<Room> {
    //     return this.RoomsService.findOne(id);
    // }

    // @Put(':id')
    // async update(@Param('id') id: string, @Body() Room: Room): Promise<Room> {
    //     return this.RoomsService.update(id, Room);
    // }

    // @Delete(':id')
    // async remove(@Param('id') id: string): Promise<void> {
    //     return this.RoomsService.remove(id);
    // }
}
