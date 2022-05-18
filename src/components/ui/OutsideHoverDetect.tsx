import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAlerter = (ref: any, outsideFunc: any) => {
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
		document.addEventListener("mouseover", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mouseover", handleClickOutside);
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
const OutsideHoverDetect = (props: Props) => {
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, props.outsideFunc);
	return <div children={props.children} ref={wrapperRef} />;
}

export default OutsideHoverDetect;