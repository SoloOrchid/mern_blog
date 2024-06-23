import {Box, Button, FileInput, LoadingOverlay, MultiSelect, TextInput} from "@mantine/core";
import {Link, RichTextEditor} from "@mantine/tiptap";
import React, {useEffect, useState} from "react";
import api from "@/Utils/api";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";


export default function PostForm({fileValue, setFileValue, data, loading, setData, tagsValue, setTagsValue, handleSave, handlePreview, editor}) {

    const [tagsData, setTagsData] = useState<string[]>([])
    useEffect(() => {
        async function getTags() {
            const res = await api('categories', {
                method: 'GET',
            })

            if (!res) {
                console.log('error this whole page')
            }

            return res.json()
        }

        getTags()
            .then(res => setTagsData(res))
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem'
        }}>
            <Box pos={"relative"}>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>
                <TextInput
                    withAsterisk
                    label="Title"
                    placeholder="Your title"
                    key={'title'}
                    value={data.title}
                    onChange={(e) => setData({...data, title: e.target.value})}
                />

                <div>
                    <label style={{fontWeight: 500, fontSize: "var(--input-label-size, var(--mantine-font-size-sm))"}}>Article
                        Contet</label>
                    <RichTextEditor editor={editor} style={{flex: 3}}>
                        <RichTextEditor.Toolbar sticky stickyOffset={60}>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold/>
                                <RichTextEditor.Italic/>
                                <RichTextEditor.Strikethrough/>
                                <RichTextEditor.ClearFormatting/>
                                <RichTextEditor.Code/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.H1/>
                                <RichTextEditor.H2/>
                                <RichTextEditor.H3/>
                                <RichTextEditor.H4/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Blockquote/>
                                <RichTextEditor.Hr/>
                                <RichTextEditor.BulletList/>
                                <RichTextEditor.OrderedList/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Link/>
                                <RichTextEditor.Unlink/>
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Undo/>
                                <RichTextEditor.Redo/>
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>

                        <RichTextEditor.Content/>
                    </RichTextEditor>
                </div>

                {
                    tagsData.length > 0
                        ? <MultiSelect
                            label="Tags"
                            placeholder="Pick value"
                            value={tagsValue}
                            onChange={setTagsValue}
                            data={tagsData}
                        />
                        : null
                }
                <FileInput mt={10} placeholder={"Upload a image"} value={fileValue} onChange={setFileValue} />
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: '2rem',
                    gap: '1rem'
                }}>
                    <Button onClick={handlePreview}>Preview</Button>
                    <Button disabled={loading} onClick={handleSave}>Post!</Button>
                </div>
            </Box>
        </div>
    )
}