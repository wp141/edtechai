import React from 'react'
import Tiptap from './Tiptap.jsx'
import { Affix, rem, Button } from '@mantine/core'
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react'
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { Highlight } from '@tiptap/extension-highlight';
import { StarterKit }  from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';

export default function GenerateDocEditor({props, refs}) {

  var content = `<h2 style="text-align: center;">${props.results.topic}</h2>`;
  for (let i = 0; i < props.results.questions.length; i++) {
    content += `<p style="text-decoration: underline;">Question ${i+1}</p>`;
    content += `<p>${props.results.questions[i]}</p>`;
    if (props.results.solutions.length > 0) {
      content += `<p>${props.results.solutions[i]}</p>`;
    }
    content += '<p/>';
  }
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
  });

  async function finish() {
    props.setDocContent(editor.getHTML());
    props.nextStep();
  }
  
  return (
    <div>
        <Tiptap props={{...props, editor}} refs={{...refs}}/>
        {/* <Affix position={{ bottom: rem(40), left: rem(40) }}>
            <Button size="lg" onClick={() => props.nextStep()}>Back<IconChevronsLeft/></Button>
        </Affix> */}
        <Affix position={{ bottom: rem(40), right: rem(40) }}>
            <Button size="lg" onClick={finish}>Finish<IconChevronsRight/></Button>
        </Affix>
    </div>
  )
}
