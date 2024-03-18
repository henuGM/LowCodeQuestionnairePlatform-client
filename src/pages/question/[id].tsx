import PageWrapper from '@/components/PageWrapper'
import { getQuestionById } from '@/services/question'
import { getComponent } from '@/components/QuestionComponents'
import styles from '@/styles/Question.module.scss'

type PropsType = {
  code: number,
  data?: {
    id: string
    title: string
    desc?: string
    js?: string
    css?: string
    isPublished: boolean
    isDeleted: boolean
    componentList: Array<any>
  }
  msg?: string
}

export default function Question(props: PropsType) {
  const { code, data, msg = '' } = props

  if (code !== 0) {
    return <PageWrapper title="错误">
      <h1>错误</h1>
      <p>{msg}</p>
    </PageWrapper>
  }

  const { id, title = '', desc = '', isDeleted, isPublished, componentList = [] } = data || {}

  if (isDeleted) {
    return <PageWrapper title={title} desc={desc}>
      <h1>{title}</h1>
      <p>该问卷已经被删除</p>
    </PageWrapper>
  }

  if (!isPublished) {
    return <PageWrapper title={title} desc={desc}>
      <h1>{title}</h1>
      <p>该问卷尚未发布</p>
    </PageWrapper>
  }
  
  const ComponentListElem = <>
    {componentList.map(c => {
      const ComponentElem = getComponent(c)
      return <div key={c.fe_id} className={styles.componentWrapper}>
        {ComponentElem}
      </div>
    })}
  </>

  return <PageWrapper title={title} desc={desc}>
    <form method='post' action="/api/answer">
      <input type="hidden" name="questionId" value={id}/>
      
      {ComponentListElem}

      <div className={styles.submitBtnContainer}>
        <button type="submit">提交</button>
      </div>
    </form>
  </PageWrapper>
}

export async function getServerSideProps(context: any) {
  const { id = '' } = context.params

  const res = await getQuestionById(id)
    res.data.componentList=JSON.parse(res.data.componentList)
  
  return {
    props: res
  }
}
