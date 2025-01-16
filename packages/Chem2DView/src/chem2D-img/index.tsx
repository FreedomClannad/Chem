import { MolSerializer, LogSettings } from "ketcher-core";
import { useEffect, useRef, memo, ReactNode, useState, CSSProperties, MouseEvent } from "react";
import { HighlightMol, RenderStruct } from "@/chem2D-svg/RenderStruct";
import { v4 as uuid4 } from "uuid";
import { Spinner } from "@/chem2D-loading";
import "./styles.css";
import { ZoomInOutlined } from "@ant-design/icons";
import Image from "rc-image";
import "rc-image/assets/index.css";
import { SvgTransformUrl } from "@/utils";
import { defaultIcons } from "./common";

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
export type MolIMGProps = {
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
	preview?: boolean | { minScale: number; maxScale: number };
};

const Error = () => {
	return <div className="error-container">Error</div>;
};

// 编写JSDoc
/**
 * @component
 * @description 生成SVG图片
 * @param {MolSVGProps} props - Props
 * @returns {ReactNode} SVG图片
 * */
const Chem2DIMG = memo((props: MolIMGProps) => {
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
		error = <Error />,
		preview = true
	} = props;
	const moleculeRef = useRef<HTMLDivElement>(null);

	const [errorState, setErrorState] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [previewSrc, setPreviewSrc] = useState<string>("");
	const [previewVisible, setPreviewVisible] = useState<boolean>(false);

	const { minScale, maxScale } = typeof preview === "object" ? preview : { minScale: 1, maxScale: 50 };

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

	const handleOpenPreview = (e: MouseEvent) => {
		if (moleculeRef && moleculeRef.current) {
			const clientArea = moleculeRef.current;
			const url = SvgTransformUrl(clientArea);
			if (url) {
				setPreviewSrc(url);
				setPreviewVisible(true);
			}
		}
		e.stopPropagation();
	};

	const renderSVG = () => {
		if (moleculeRef && moleculeRef.current && mol) {
			const clientArea = moleculeRef.current;
			const svgElementList = clientArea.querySelectorAll("svg");
			const svgList = Array.from(svgElementList);
			console.log(svgList);
			svgList.map(el => {
				if (el.parentElement === clientArea) {
					clientArea.removeChild(el);
				}
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
		<div style={{ width, height, ...style }} className={["chem2d-img-container", rootClass].join(" ")}>
			{errorState ? (
				<>{error}</>
			) : (
				<div className={["chem2d-img-box", boxClass].join(" ")} ref={moleculeRef}>
					{loading && (
						<div className="chem2d-img-loading">
							<Spinner />
						</div>
					)}
					{preview && mol && (
						<button className="chem2d-img-preview-button" onClick={handleOpenPreview}>
							<ZoomInOutlined />
						</button>
					)}
				</div>
			)}
			{preview && mol && (
				<div onClick={(e: MouseEvent) => e.stopPropagation()} className="chem2d-img-preview-wrapper">
					<Image
						preview={{
							icons: defaultIcons,
							src: previewSrc,
							visible: previewVisible,
							minScale,
							maxScale,
							onVisibleChange: visible => {
								setPreviewVisible(visible);
							}
						}}
					></Image>
				</div>
			)}
		</div>
	);
});

export { Chem2DIMG };
