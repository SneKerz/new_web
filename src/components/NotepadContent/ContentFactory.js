import React, { useEffect, useState, useContext } from 'react'
import DataContext from '../../contexts/dataContext'
import About from './About'
import Resume from './Resume'
import Contact from './Contact'
import Projects from './Projects'
import ContactTest from './contactTest'
import Whitepaper from './Whitepaper'

function ContentFactory({ id, isMobile }) {
    const data = useContext(DataContext);
    const [item, setItem] = useState(null);

    useEffect(() => {
        const file = data.getItem(id);
        setItem(file);
    }, [id, data]);

    if (item === null) {
        return (<div></div>);
    }

    switch (item.id) {
        case 'about':
            return <About content={item.content} />
        case 'resume':
            return <Resume content={item.content} />
        
        case 'contact':
            return <Contact content={item.content} />
        case 'projects':
            return <Projects content={item.content} />
        case 'contactTest':
            return <ContactTest content={item.content} />
        case 'whitepaper':
            return <Whitepaper content={item.content} />
        default:
            return (<div></div>);
    }

}

export default ContentFactory
