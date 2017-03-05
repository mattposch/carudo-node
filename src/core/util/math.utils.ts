export class MathHelper {
    public static roundDown(num: number, decimals: number): number {
        decimals = decimals || 0;
        return ( Math.floor( num * Math.pow(10, decimals) ) / Math.pow(10, decimals) );
    }
}
