import React, { memo } from 'react'
import { MainProductsList, ProductsHead } from './parts'

const MainProducts = () => {

    return (
        <div className="main_products">
            <ProductsHead />
            <MainProductsList />
        </div>
    )
}

export default memo(MainProducts)
