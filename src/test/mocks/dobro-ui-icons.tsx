import type { SVGProps } from 'react'

type MockIconProps = SVGProps<SVGSVGElement> & {
	size?: number | string
}

function createMockIcon(displayName: string) {
	function MockIcon({ size = 24, width = size, height = size, ...props }: MockIconProps) {
		return (
			<svg
				{...props}
				aria-hidden={props['aria-hidden'] ?? true}
				height={height}
				viewBox="0 0 24 24"
				width={width}
			/>
		)
	}

	MockIcon.displayName = displayName

	return MockIcon
}

export const IconAddLinear = createMockIcon('IconAddLinear')
export const IconArrowLeftLinear = createMockIcon('IconArrowLeftLinear')
export const IconBookmarkBulk = createMockIcon('IconBookmarkBulk')
export const IconBriefcaseBulk = createMockIcon('IconBriefcaseBulk')
export const IconCalendar2Bulk = createMockIcon('IconCalendar2Bulk')
export const IconCalendarBulk = createMockIcon('IconCalendarBulk')
export const IconCalendarLinear = createMockIcon('IconCalendarLinear')
export const IconCallBulk = createMockIcon('IconCallBulk')
export const IconCallLinear = createMockIcon('IconCallLinear')
export const IconChart4Bold = createMockIcon('IconChart4Bold')
export const IconCheckLinear = createMockIcon('IconCheckLinear')
export const IconChevronLeftLinear = createMockIcon('IconChevronLeftLinear')
export const IconChevronRightLinear = createMockIcon('IconChevronRightLinear')
export const IconChevronUpLinear = createMockIcon('IconChevronUpLinear')
export const IconClipboardBulk = createMockIcon('IconClipboardBulk')
export const IconCrossLinear = createMockIcon('IconCrossLinear')
export const IconCupBulk = createMockIcon('IconCupBulk')
export const IconDangerBulk = createMockIcon('IconDangerBulk')
export const IconDangerLinear = createMockIcon('IconDangerLinear')
export const IconDocumentBold = createMockIcon('IconDocumentBold')
export const IconDownloadLinear = createMockIcon('IconDownloadLinear')
export const IconEyeLinear = createMockIcon('IconEyeLinear')
export const IconEyeSlashLinear = createMockIcon('IconEyeSlashLinear')
export const IconFilterLinear = createMockIcon('IconFilterLinear')
export const IconForbidden2Linear = createMockIcon('IconForbidden2Linear')
export const IconInfLinear = createMockIcon('IconInfLinear')
export const IconInfoCircleBulk = createMockIcon('IconInfoCircleBulk')
export const IconKeyBulk = createMockIcon('IconKeyBulk')
export const IconLink2Linear = createMockIcon('IconLink2Linear')
export const IconLocationBulk = createMockIcon('IconLocationBulk')
export const IconMap2Bulk = createMockIcon('IconMap2Bulk')
export const IconMenuLinear = createMockIcon('IconMenuLinear')
export const IconMessages2Bulk = createMockIcon('IconMessages2Bulk')
export const IconMinusLinear = createMockIcon('IconMinusLinear')
export const IconNoteBulk = createMockIcon('IconNoteBulk')
export const IconNotificationLinear = createMockIcon('IconNotificationLinear')
export const IconProfile2userBold = createMockIcon('IconProfile2userBold')
export const IconProfile2userBulk = createMockIcon('IconProfile2userBulk')
export const IconProfile2userLinear = createMockIcon('IconProfile2userLinear')
export const IconProfileBold = createMockIcon('IconProfileBold')
export const IconProfileBulk = createMockIcon('IconProfileBulk')
export const IconProfileCircleBulk = createMockIcon('IconProfileCircleBulk')
export const IconProfileCircleLinear = createMockIcon('IconProfileCircleLinear')
export const IconProfileLinear = createMockIcon('IconProfileLinear')
export const IconQuestionBold = createMockIcon('IconQuestionBold')
export const IconQuestionBulk = createMockIcon('IconQuestionBulk')
export const IconQuestionLinear = createMockIcon('IconQuestionLinear')
export const IconQuestionTwotone = createMockIcon('IconQuestionTwotone')
export const IconRankingBulk = createMockIcon('IconRankingBulk')
export const IconSmsBulk = createMockIcon('IconSmsBulk')
export const IconSmsLinear = createMockIcon('IconSmsLinear')
export const IconStarBulk = createMockIcon('IconStarBulk')
export const IconTaskSquareBulk = createMockIcon('IconTaskSquareBulk')
export const IconTickCircleBulk = createMockIcon('IconTickCircleBulk')
export const IconTickCircleLinear = createMockIcon('IconTickCircleLinear')
export const IconTimer2Bulk = createMockIcon('IconTimer2Bulk')
export const IconTriangleBulk = createMockIcon('IconTriangleBulk')
export const IconTrashLinear = createMockIcon('IconTrashLinear')
export const IconGlobalBulk = createMockIcon('IconGlobalBulk')
export const IconPeopleBold = createMockIcon('IconPeopleBold')
export const IconTeacherBulk = createMockIcon('IconTeacherBulk')
export const IconUserBulk = createMockIcon('IconUserBulk')
export const IconUserTagBulk = createMockIcon('IconUserTagBulk')
