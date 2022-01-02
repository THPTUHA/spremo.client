import  { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAlerter = (ref: any, outsideFunc: Function) => {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				if (outsideFunc) {
					outsideFunc();
				}
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */

interface Props {
	outsideFunc: () => void,
	[key: string]: any
}
const OutsideClickDetect = (props: Props) => {
	const wrapperRef = useRef(null);
	const {outsideFunc,...res} = props;
	useOutsideAlerter(wrapperRef, props.outsideFunc);

	return <div {...res} ref={wrapperRef} />;
}

export default OutsideClickDetect;