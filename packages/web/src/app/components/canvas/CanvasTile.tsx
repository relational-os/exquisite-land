import React, { useEffect, useState } from "react";
import { useFetchTile } from "@app/features/Graph";
import useTilesInWallet from "@app/features/useTilesInWallet";
import { useWallet } from "@gimmixorg/use-wallet";
import { ENSName } from "react-ens-name";
import { useOpenNeighborStore } from "@app/features/useOpenNeighborsForWallet";

const CanvasTile = ({
	x,
	y,
	openEditor,
	openGenerateInvite,
	style,
}: {
	x: number;
	y: number;
	openEditor: () => void;
	openGenerateInvite: () => void;
	style?: React.CSSProperties;
}) => {
	const { tile } = useFetchTile(x, y);

	const { account } = useWallet();
	const { tiles: tilesOwned } = useTilesInWallet(account);
	const [isOwned, setOwned] = useState(false);
	useEffect(() => {
		if (tilesOwned?.find((t) => t.x == x && t.y == y)) {
			setOwned(true);
		}
	}, [JSON.stringify(tilesOwned)]);

	const isInvitable = useOpenNeighborStore(
		(state) => !!state.openNeighbors.find((t) => t.x == x && t.y == y)
	);

	const onClick = () => {
		if (isOwned && tile.status == "UNLOCKED") openEditor();
		else if (isInvitable) openGenerateInvite();
	};
	return (
		<div className="tile" onClick={onClick} style={style}>
			{tile?.svg && (
				<div className="svg" dangerouslySetInnerHTML={{ __html: tile.svg }} />
			)}
			<div className="meta">
				<div className="coords">
					[{x},{y}]
				</div>
				<div className="deets">
					{tile?.owner && (
						<div className="owner">
							{tile.owner.id.toLowerCase() ==
							process.env.NEXT_PUBLIC_LAND_GRANTER_CONTRACT_ADDRESS?.toLowerCase() ? (
								"UNCLAIMED"
							) : (
								<ENSName address={tile.owner.id} />
							)}
						</div>
					)}
					{isOwned && <div className="owned">Your tile!</div>}
					{isInvitable && <div className="invitable">Invite!</div>}
				</div>
			</div>
			<style jsx>{`
				.tile {
					position: relative;
					 {
						/* border: ${tile?.status == "LOCKED" ? 0 : 0}px dotted #325ba2; */
					}
					background-color: ${isInvitable
						? "#ffd80033"
						: tile?.status == "UNLOCKED"
						? "#444"
						: "#333"};

					background-size: 10% 10%;
					background-image: ${tile?.status == "UNLOCKED"
						? `radial-gradient(circle, #333 1px, rgba(40, 40, 40, 0) 1px)`
						: "radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)"};

					background-image: ${isOwned &&
					"linear-gradient(-45deg, #ffe761, #fb922b)"};
					background-size: ${isOwned && "400% 400%"};
					animation: gradient ${isOwned && " 3s ease infinite"};
				}
				.tile:hover {
					background-color: ${isInvitable
						? "#ffd80033"
						: tile?.status == "UNLOCKED"
						? "#eee"
						: "none"};
					background-image: ${tile?.status == "UNLOCKED"
						? `none`
						: "radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)"};

					cursor: pointer;
					cursor: ${tile?.status == "LOCKED" && "default"};
				}
				.svg {
					width: 100%;
					height: 100%;
				}
				.svg :global(svg) {
					display: block;
					width: 100%;
					height: 100%;
				}
				.meta {
					display: ${isInvitable
						? "block"
						: tile?.status == "UNLOCKED"
						? "block"
						: "none"};
					padding: 10px;
					opacity: 0.7;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					font-size: 1.5rem;
					text-align: center;
				}

				.tile:hover .meta {
					${tile?.svg &&
					"display: block; cursor: pointer; background: rgba(0,0,0,0.25); color:#fff; text-shadow: 2px 2px #000; opacity: 1;"};
				}

				.coords {
				}

				.deets {
					position: absolute;
					bottom: 10px;
					left: 0;
					right: 0;
				}

				@keyframes gradient {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}
			`}</style>
		</div>
	);
};

export default React.memo(
	CanvasTile,
	(prev, next) => prev.x === next.x && prev.y === next.y
);
