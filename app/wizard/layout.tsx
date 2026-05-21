import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='relative 
                    flex
                    h-screen 
                    w-full 
                    flex-col 
                    justify-center 
                    items-center'>
                      <div className="mt-12">
                         {children}
                      </div>
      
        </div>
  )
}

export default layout