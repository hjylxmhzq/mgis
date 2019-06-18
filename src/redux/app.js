export const types = {
    CHANGEMENU: 'app/changemenu'
}

export const actions = {
    changeMenu(menuName) {
        return {
            type: types.CHANGEMENU,
            menu: menuName
        }
    }
}

const initialState = {
    selectedMenu: 'index'
}

export function reducer(state = initialState, actions) {
    switch (actions.type) {
        case types.CHANGEMENU:
            return {...state, selectedMenu: actions.menu};
            break;
        default:
            return state;
    }
}