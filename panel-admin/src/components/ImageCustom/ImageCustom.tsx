import { SetStateAction, useState } from "react";
import LoadingImg from "../LoadingImg/LoadingImg";
type ImageType = {
    src: any;
    alt: string | null;
    className?: string;
    width?: number;
    height?: number;
    classPlus?: string;
    figureClass?: string;
    onClick?: (value: any) => void
    icon?: boolean
};
export default function ImageCustom({
    width,
    height,
    src,
    alt,
    className,
    classPlus,
    figureClass,
    onClick,
    icon
}: ImageType) {
    const [load, setLoad] = useState<boolean>(true);
    const [error, setError] = useState<SetStateAction<null> | string>(null)
    const classImage = className ? className : classPlus ? `${classPlus} rounded-md shadow-md  table mx-auto` : " rounded-md shadow-md"
    return (
        <figure className={figureClass || "w-full relative"}>
            <img
                width={width}
                height={height}
                loading="lazy"
                onClick={onClick}
                // placeholder="blur"
                // blurDataURL="data:image/gif;base64,..."
                onLoad={() => setLoad(false)}
                src={error ? error : src || "/errorImage.webp"}
                alt={alt || "error"}
                className={classImage}
                onError={() => setError("/errorImage.webp")}
            />
            {load && <LoadingImg />}
        </figure>
    );
}
