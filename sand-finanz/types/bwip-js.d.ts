declare module "bwip-js" {
  interface ToBufferOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    width?: number;
    includetext?: boolean;
    paddingwidth?: number;
    paddingheight?: number;
    [key: string]: unknown;
  }
  const bwipjs: {
    toBuffer(options: ToBufferOptions): Promise<Buffer>;
  };
  export default bwipjs;
}
