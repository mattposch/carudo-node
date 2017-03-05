import {Response} from 'express';
import {Serialize} from 'cerialize';

/**
 * Streams an Iridium query cursor (which delivers n elements) to a JSON response stream.
 * @param cursor    The Iridium cursor
 * @param response  The express response
 * @param type      The type which contains the cerialize annotations
 */
export function iridiumCursor2JsonResponse(
    cursor: any, response: Response, type: any): void {
    let isFirst: boolean = true;
    response.set('Content-Type', 'application/json');

    cursor.cursor
        .on('data', function onData(data: any) {
            if (isFirst) {
                response.write('[');
                isFirst = false;
            } else {
                response.write(', ');
            }
            response.write(JSON.stringify(Serialize(data, type)));
        })
        .on('end', function onEnd() {
            if (!isFirst) {
                response.end(']');
            } else {
                response.end();
            }
        });
}
