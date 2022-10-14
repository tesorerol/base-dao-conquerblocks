import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../View/Home/Home'
import Proposal from '../../View/Proposal/Proposal'

const Navigation = () => {
    return (
        <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/proposals' element={<Proposal />} />
        </Routes>
    )
}

export default Navigation