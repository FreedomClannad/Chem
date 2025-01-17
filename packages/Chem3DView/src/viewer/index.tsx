import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import "molstar/build/viewer/molstar.css";
import "./styles.css";
import type { loadStructureUrlType, loadStructureDataType } from "@/types";
import { ViewerRender } from "./viewer-render";
import { getShortId } from "@/utility";

type Props = {
	id?: string;
	onLoad?: () => void;
};

export type ViewerHandle = {
	loadStructureFromUrl: (loadFileURL: loadStructureUrlType) => Promise<any> | null;
	loadStructureFromData: (loadFileData: loadStructureDataType) => Promise<any> | null;
	clear: () => void;
	isLoad: () => boolean;
};
const Viewer = forwardRef<ViewerHandle, Props>((props, ref) => {
	const { id = getShortId(), onLoad } = props;
	const molstart = useRef<ViewerRender | null>(null);

	useEffect(() => {
		ViewerRender.create(id, {
			layoutIsExpanded: false,
			layoutShowControls: true,
			layoutShowRemoteState: false,
			layoutShowSequence: true,
			layoutShowLog: false,
			layoutShowLeftPanel: false,

			viewportShowExpand: false,
			viewportShowSelectionMode: false,
			viewportShowAnimation: false,
			viewportShowControls: false,
			viewportShowSettings: false,
			viewportShowTrajectoryControls: true, // 多个分子控制左右切换
			volumeStreamingServer: "https://maps.rcsb.org"
		}).then(res => {
			molstart.current = res;
			console.log(res);
			setTimeout(() => {
				onLoad?.();
			}, 500);

			// ViewerStart = res;
		});
	}, []);

	// 加载模型
	const loadStructureFromUrl = async (loadStructureUrl: loadStructureUrlType) => {
		if (molstart && molstart.current) {
			console.log("loadStructureUrl", loadStructureUrl);
			return molstart.current?.loadStructureFromUrl(loadStructureUrl);
		}
		return null;
	};

	// 根据传入的data来进行渲染数据
	const loadStructureFromData = async (loadStructureData: loadStructureDataType) => {
		if (molstart && molstart.current) {
			console.log("loadStructureData", loadStructureData);
			return molstart.current?.loadStructureFromData(loadStructureData);
		}
		return null;
	};
	// 清空画布
	const clear = () => {
		if (molstart && molstart.current) molstart.current?.plugin.clear();
	};
	// 判断mol是否加载完成
	const isLoad = () => {
		return !!(molstart && molstart.current);
	};

	useImperativeHandle(ref, () => {
		return {
			loadStructureFromUrl,
			loadStructureFromData,
			clear,
			isLoad
		};
	}, []);
	return (
		<>
			<div style={{ width: "100%", height: "100%" }} id={id}></div>
		</>
	);
});
Viewer.displayName = "Viewer";
export { Viewer };
