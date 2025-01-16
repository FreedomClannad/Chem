import { MolSerializer, LogSettings } from "ketcher-core";
import { useEffect, useRef, memo, ReactNode, useState, CSSProperties } from "react";
import { HighlightMol, RenderStruct } from "./RenderStruct";
import { v4 as uuid4 } from "uuid";
import { Spinner } from "@/chem2D-loading";
import "./styles.css";
// 编写JSDoc
/**
 * @description 生成SVG图片
 * @typedef {Object} MolSVGProps
 * @param {string} [mol] - molecule string
 * @param {CSSProperties} [style] - style
 * @param {string} [rootClass] - root class
 * @param {string} [boxClass] - box class
 * @param {string} [id] - id
 * @param {number} [width] - width
 * @param {number} [height] - height
 * */
export type MolSVGProps = {
	mol: string;
	style?: CSSProperties;
	rootClass?: string;
	boxClass?: string;
	id?: string;
	width?: number;
	height?: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options?: any;
	highlight?: HighlightMol;
	error?: ReactNode;
};

const Error = () => {
	return <div className="chem2d-error-container">Error</div>;
};

// 编写JSDoc
/**
 * @component
 * @description 生成SVG图片
 * @param {MolSVGProps} props - Props
 * @returns {ReactNode} SVG图片
 * */
const Chem2DSVG = memo((props: MolSVGProps) => {
	const {
		mol,
		id = uuid4(),
		style,
		rootClass = "",
		boxClass = "",
		width = 400,
		height = 400,
		options,
		highlight,
		error = <Error />
	} = props;
	const moleculeRef = useRef<HTMLDivElement>(null);
	const [errorState, setErrorState] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		// 新版加了日志, 源码是调用window上属性，为了防止和Kethcer的Editer的Window冲突，所以这里针对window的ketcher进行判断
		if (!("ketcher" in window && window.ketcher !== undefined)) {
			const logging: LogSettings = { enabled: false, showTrace: false, level: 0 };
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ketcher = { logging };
		}
	}, []);

	useEffect(() => {
		setErrorState(false);
		renderSVG();
	}, [mol, width, height]);

	const renderSVG = () => {
		if (moleculeRef && moleculeRef.current && mol) {
			const clientArea = moleculeRef.current;
			const svgElementList = clientArea.querySelectorAll("svg");
			const svgList = Array.from(svgElementList);
			svgList.map(el => {
				clientArea.removeChild(el);
			});
			setLoading(true);
			try {
				const molSerializer = new MolSerializer();
				const struct = molSerializer.deserialize(mol);
				struct.name = id;
				RenderStruct.render({
					el: clientArea,
					struct,
					options: {
						scale: 75,
						autoScale: true,
						autoScaleMargin: 30,
						width: width || clientArea.clientWidth - 10,
						height: height || clientArea.clientHeight - 10,
						showValenceWarnings: false,
						showValence: false,
						...options
					},
					highlight
				});
			} catch (e) {
				setErrorState(true);
				console.error("渲染分子SVG错误:", e);
			} finally {
				setLoading(false);
			}
		}
	};
	return (
		<div style={{ width, height, ...style }} className={["chem2d-svg-container", rootClass].join(" ")}>
			{errorState ? (
				<>{error}</>
			) : (
				<div className={["chem2d-svg-box", boxClass].join(" ")} ref={moleculeRef}>
					{loading && (
						<div className="chem2d-svg-loading">
							<Spinner />
						</div>
					)}
				</div>
			)}
		</div>
	);
});

export { Chem2DSVG };
