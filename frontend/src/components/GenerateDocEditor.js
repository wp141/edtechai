import React from 'react'
import Tiptap from './Tiptap.jsx'

export default function GenerateDocEditor({props, refs}) {

  return (
    <div>
        <Tiptap props={{...props}} refs={{...refs}}/>
    </div>
  )
}
