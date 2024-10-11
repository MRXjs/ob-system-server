import { Member } from './types'

export const getMemberValues = (member: Member) => [
    member.member_id,
    member.full_name,
    member.year_of_joining_school,
    member.year_of_out_school,
    member.facebook_name,
    member.phone_number,
    member.address,
    member.workplace,
    member.job,
    member.dob,
    member.gender,
    member.civil_status,
    member.whatsapp_number,
    member.registration_fee_paid,
    member.avatar,
]

export const formatMemberData = (member: any) => {
    return {
        memberId: member.member_id,
        fullName: member.full_name,
        yearOfJoiningSchool: member.year_of_joining_school,
        yearOfOutSchool: member.year_of_out_school,
        facebookName: member.facebook_name,
        studyPeriod:
            member.year_of_joining_school && member.year_of_out_school
                ? `${member.year_of_joining_school}-${member.year_of_out_school}`
                : '',
        phoneNumber: member.phone_number,
        address: member.address,
        job: member.job,
        workplace: member.workplace,
        dob: member.dob,
        gender: member.gender,
        civilStatus: member.civil_status,
        whatsappNumber: member.whatsapp_number,
        avatar: member.avatar,
        registrationFeePaid: member.registration_fee_paid,
    }
}
