import { Render, Struct, fromHighlightCreate } from "ketcher-core";
export type HighlightMol = {
	atoms: number[];
	bonds: number[];
	color?: string;
};

type renderProps = {
	el: HTMLElement | null;
	struct: Struct | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options: any;
	highlight?: HighlightMol | null;
};

export class RenderStruct {
	static prepareStruct(struct: Struct) {
		if (struct.sgroups.size > 0) {
			const newStruct = struct.clone();
			newStruct.sgroups.delete(0);
			return newStruct;
		}
		return struct;
	}

	static render({ el, struct, options = {}, highlight }: renderProps) {
		if (el && struct) {
			const preparedStruct = this.prepareStruct(struct);
			preparedStruct.initHalfBonds();
			preparedStruct.initNeighbors();
			preparedStruct.setImplicitHydrogen();
			preparedStruct.markFragments();
			const rnd = new Render(el, {
				autoScale: true,
				...options
			});
			preparedStruct.rescale();
			rnd.setMolecule(preparedStruct);
			if (highlight) {
				const { atoms, bonds, color = "#FF7F50" } = highlight;
				const atomsMap = rnd.ctab.atoms;
				const boundsMap = rnd.ctab.bonds;
				const atomList = Array.from(atomsMap.keys());
				const boundsList = Array.from(boundsMap.keys());
				const nAtoms: number[] = [];
				const nBonds: number[] = [];
				atoms?.forEach(index => {
					nAtoms.push(atomList[index]);
				});
				bonds?.forEach(index => {
					nBonds.push(boundsList[index]);
				});
				fromHighlightCreate(rnd.ctab, [{ atoms: nAtoms, bonds: nBonds, color, rgroupAttachmentPoints: [] }]);
				rnd.update();
			}
		}
	}
}
