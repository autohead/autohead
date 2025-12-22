import { Modal } from "../Modal";
import type { Product } from "../../types/product";

interface WarningProps {
    image: string;
    product: Product | null;
    isOpen: boolean;
    onCancel: () => void;
}

const ImagePreviewDialoge = (props: WarningProps) => {
    return (

        <Modal isOpen={props.isOpen} onClose={props.onCancel} title="ImagePreview" size="lg">
            <div className="flex items-center  justify-center mb-4">
                <h2 className="text-lg  font-semibold">{props.product?.product_name}</h2>
            </div>
            <div className="flex justify-center mt-4">
                <img src={props.image} alt="Preview" />
                
            </div>
        </Modal >

    );
};

export default ImagePreviewDialoge;
