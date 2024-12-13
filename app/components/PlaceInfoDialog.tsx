import useDialog from '../store/useDialog';
import usePlaceData from '../store/usePlaceData';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const PlaceInfoDialog = () => {
    const { showPlaceInfo, setShowPlaceInfo } = useDialog();
    const { selectedPlace } = usePlaceData();


    return (
        <Dialog
            open={showPlaceInfo}
            onClose={() => setShowPlaceInfo(false)}
            maxWidth="sm"
            fullWidth={true}
        >
            <DialogTitle className="flex justify-between items-center">
                <div>
                    <p className="text-2xl text-[#2391ff]">{selectedPlace.place_name}</p>
                    <p className="text-sm text-[#868e96]">{selectedPlace.address_name}</p>
                </div>
                <div>
                    <button className="text-2xl" onClick={() => setShowPlaceInfo(false)}>
                        <i className="ri-close-large-fill"></i>
                    </button>
                </div>
            </DialogTitle>
            <DialogContent>

            </DialogContent>
        </Dialog>
    )
};

export default PlaceInfoDialog;