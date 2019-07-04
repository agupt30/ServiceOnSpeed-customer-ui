const initialState = {
    selectedVehicle:{}
}

export default function VehicleSelected(state=initialState, action) {
    switch (action.type){
        case "VEHICLE_SELECT":
        return {
            ...state,
            selectedVehicle:action.payload
        }
        default:
        return state
    }
}