import { nanoid } from "nanoid";
// 生成8位短唯一短id
export const getShortId = () => {
	return nanoid(8);
};
