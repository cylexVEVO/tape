import * as React from "react";
import styled, {keyframes, css} from "styled-components";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../redux";

const spinFrames = (props: {translateX: number, translateY: number}) => keyframes`
	0% {
		transform: translate(${props.translateX}px, ${props.translateY}px) rotate(0deg);
	}
	100% {
		transform: translate(${props.translateX}px, ${props.translateY}px) rotate(720deg);
	}
`;

const spinAnim = css`
	${spinFrames} 5s linear infinite;
`;

const G = styled.g<{animate: boolean, translateX: number, translateY: number, reversed?: boolean}>`
	animation: ${spinAnim};
	animation-play-state: ${props => props.animate ? "running" : "paused"};
  	${props => props.reversed ? "animation-direction: reverse;" : ""};
	transform-box: fill-box;
	transform-origin: center center;
`;

const mapState = (state: RootState) => ({
	playing: state.player.playing
});

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>;

class Tape extends React.Component<Props> {
	render() {
		const {playing} = this.props;

		return (
			<div>
				<svg width="281px" height="128px" viewBox="0 0 281 128" xmlns="http://www.w3.org/2000/svg">
					<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
						<g id="tape" strokeWidth="1.8">
							<g>
								<g id="static" transform="translate(22.800000, 24.000000)">
									<path d="M206.7768,84.8904 C206.5848,84.4476 206.376,84.012 206.1516,83.5872" id="Path" stroke="#656579" opacity="0.5"/>
									<circle id="Oval" stroke="#656579" cx="205.9692" cy="27.9792" r="27.3288"/>
									<g id="Group" transform="translate(0.000000, 69.600000)" stroke="#656579">
										<path d="M182.3316,18.7896 L204.6624,23.3064" id="Path"/>
										<path d="M127.5252,29.148 L170.7924,18.7896" id="Path"/>
										<path d="M69.8868,20.5524 L110.7276,29.3232" id="Path"/>
										<path d="M34.2564,28.5816 L55.446,20.3268" id="Path"/>
										<path d="M0.3384,0.3612 L25.1136,26.2404" id="Path"/>
									</g>
									<path d="M218.2092,77.9508 L212.9316,90.0276" id="Path" stroke="#656579"/>
									<path d="M218.4744,76.9152 L232.3992,35.004" id="Path" stroke="#656579"/>
									<circle id="Oval" stroke="#FFFFFF" cx="208.2276" cy="90.0276" r="4.704"/>
									<circle id="Oval" stroke="#FFFFFF" cx="29.8644" cy="96.4248" r="4.7028"/>
									<g id="tape-head" transform="translate(109.200000, 84.000000)" stroke="#FFFFFF" strokeLinecap="round">
										<path d="M9.6468,15 L9.6,8.1624" id="Path"/>
										<path d="M18.3252,3.156 L18.3252,14.748 C18.3252,14.748 14.25,15.3876 9.6,15.3876 C4.95,15.3876 0.9684,14.748 0.9684,14.748 L0.9684,3.156 C0.9684,1.8305166 2.0429166,0.756 3.3684,0.756 L15.9252,0.756 C17.2506834,0.756 18.3252,1.8305166 18.3252,3.156 Z" id="tapehead_14_" strokeLinejoin="round"/>
									</g>
								</g>
								<g id="moving" stroke="#FFFFFF">
									<G animate={playing} translateX={190.8} translateY={109.2} id="spinnerright" transform="translate(190.800000, 109.200000)">
										<path d="M5.7036,11.82 L11.424,6.0984" id="Path" strokeLinecap="round"/>
										<circle id="Oval" cx="8.5644" cy="8.9604" r="8.16"/>
									</G>
									<G animate={playing} translateX={76.8} translateY={109.2} id="spinnerright" transform="translate(76.800000, 109.200000)">
										<path d="M5.78951976,11.6136517 L11.5099198,5.89205173" id="Path" strokeLinecap="round"/>
										<circle id="Oval" cx="8.6376" cy="8.592" r="8.16"/>
									</G>
									<G reversed animate={playing} translateX={177.6} translateY={0} id="reelright" transform="translate(177.600000, 0.000000)">
										<path d="M51.048,30.4368 L51.048,9.1452" id="Path" strokeLinecap="round"/>
										<path d="M32.2152,63.0588 L13.7748,73.7052" id="Path" strokeLinecap="round"/>
										<path d="M69.8808,63.06 L88.3224,73.704" id="Path" strokeLinecap="round"/>
										<circle id="Oval" cx="51.3516" cy="51.978" r="10.044"/>
										<path d="M64.6476,42.6156 L63.3324,43.3788 C62.8524,42.696 62.322,42.0396 61.7148,41.43 C55.938,35.6304 46.5396,35.616 40.74,41.394 C40.2228,41.9016 39.78,42.4452 39.3648,43.0032 L37.9548,42.2376 C37.2204,41.8248 36.2796,42.0852 35.88,42.8184 C35.4564,43.5528 35.7204,44.4828 36.4548,44.8968 L37.7796,45.6528 C35.2416,51.1272 36.2052,57.828 40.7052,62.3484 C43.1436,64.8 46.23,66.2076 49.4304,66.5892 L49.4628,68.1864 C49.4796,69.0312 50.1588,69.7056 51,69.6972 C51.8436,69.6864 52.5252,68.9988 52.5144,68.154 L52.5096,66.6468 C55.8408,66.3504 59.0952,64.9356 61.6524,62.3856 C66.078,57.9804 67.1268,51.4836 64.8264,46.0728 L66.1896,45.2424 C66.9144,44.8128 67.164,43.8768 66.7176,43.1532 C66.3084,42.426 65.3748,42.1872 64.6476,42.6156 Z" id="Path" strokeLinejoin="round"/>
										<circle id="reelrightmid" cx="51.1668" cy="51.9792" r="2.2428"/>
										<circle id="Oval" strokeLinecap="square" cx="51.1668" cy="51.9792" r="50.9988"/>
									</G>
									<G reversed animate={playing} translateX={0} translateY={0} id="reelleft">
										<path d="M66.672,36.0468 L81.1644,20.4492" id="Path" strokeLinecap="round"/>
										<path d="M58.266,72.7656 L64.5288,93.1152" id="Path" strokeLinecap="round"/>
										<path d="M30.6708,47.1264 L9.9144,42.3756" id="Path" strokeLinecap="round"/>
										<path d="M67.926,54.8916 L66.4572,54.504 C66.5988,53.6808 66.6876,52.842 66.6876,51.9792 C66.6876,43.7952 60.054,37.1592 51.8688,37.1592 C51.1488,37.1592 50.4456,37.2288 49.7556,37.3284 L49.3008,35.7912 C49.0716,34.9812 48.2292,34.5072 47.418,34.7364 C46.6068,34.9656 46.1352,35.8068 46.362,36.618 L46.7616,38.0832 C41.0988,40.1664 37.0512,45.5928 37.0512,51.9792 C37.0512,55.4388 38.2476,58.6176 40.236,61.1388 L39.1368,62.3004 C38.5488,62.904 38.5596,63.8676 39.162,64.458 C39.7656,65.046 40.7316,65.0328 41.3208,64.4304 L42.3828,63.36 C44.9544,65.5056 48.2592,66.798 51.87,66.798 C58.11,66.798 63.4392,62.9364 65.622,57.4764 L67.1724,57.8484 C67.9896,58.056 68.82,57.564 69.0276,56.7468 C69.2376,55.9308 68.7432,55.0992 67.926,54.8916 Z" id="Path" strokeLinejoin="round"/>
										<circle id="Oval" cx="51.87" cy="51.9792" r="50.9988"/>
										<circle id="Oval" cx="51.87" cy="51.9792" r="9.9876"/>
										<circle id="reelleftmid" cx="51.87" cy="51.9792" r="2.2416"/>
									</G>
								</g>
							</g>
						</g>
					</g>
				</svg>
			</div>
		);
	}
}

export default connector(Tape);