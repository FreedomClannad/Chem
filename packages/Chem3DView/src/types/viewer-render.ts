import { BuiltInTrajectoryFormat } from "molstar/lib/mol-plugin-state/formats/trajectory";
import { LoadStructureOptions } from "@/viewer/viewer-render.tsx";

export type loadStructureUrlType = {
	url: string;
	format: BuiltInTrajectoryFormat;
	isBinary: boolean;
	options?: LoadStructureOptions & { label?: string };
};

export type loadStructureDataType = {
	data: string | number[];
	format: BuiltInTrajectoryFormat;
	options?: { dataLabel?: string };
};
